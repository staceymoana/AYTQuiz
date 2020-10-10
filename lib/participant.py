import os
import json
import boto3
import uuid

from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr

#load DB constants
DB = os.environ['DB']
DB_TABLE = os.environ['DB_TABLE']
DB_QUERY_RECORD = os.environ['DB_QUERY_RECORD']

#load EVENT constants
EVENT_BODY = os.environ['EVENT_BODY']

#load RESPONSE constants
RESPONSE_STATUSCODE = os.environ['RESPONSE_STATUSCODE']
RESPONSE_BODY = os.environ['RESPONSE_BODY']

#load STATUSCODE constants
STATUSCODE_200 = os.environ['STATUSCODE_200']
STATUSCODE_401 = os.environ['STATUSCODE_401']
STATUSCODE_404 = os.environ['STATUSCODE_404']
STATUSCODE_500 = os.environ['STATUSCODE_500']

#instantiate DynamoDB objects
db = boto3.resource(DB)
tbl = db.Table(DB_TABLE)

def submitQuizAttempt(event, context):

	#load function constants
	REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
	REQUEST_ATTEMPTDATA = os.environ['REQUEST_ATTEMPTDATA']
	REQUEST_FIRSTNAME = os.environ['REQUEST_FIRSTNAME']
	REQUEST_LASTNAME = os.environ['REQUEST_LASTNAME']
	REQUEST_AGE = os.environ['REQUEST_AGE']
	REQUEST_GENDER = os.environ['REQUEST_GENDER']
	SORTKEY_INDEX = os.environ['SORTKEY_INDEX']
	PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
	ATTRIBUTE_CONTENT = os.environ['ATTRIBUTE_CONTENT']
	ATTRIBUTE_QUESTION = os.environ['ATTRIBUTE_QUESTION']
	ATTRIBUTE_OPTIONS = os.environ['ATTRIBUTE_OPTIONS']
	ATTRIBUTE_ISCORRECT = os.environ['ATTRIBUTE_ISCORRECT']
	ATTRIBUTE_ANSWERS = os.environ['ATTRIBUTE_ANSWERS']
	ATTRIBUTE_VALUE = os.environ['ATTRIBUTE_VALUE']	
	RESPONDENT_FILTER = os.environ['RESPONDENT_FILTER']
	STATUS_FILTER = os.environ['STATUS_FILTER']
	RESPONSE_SCORE = os.environ['RESPONSE_SCORE']

	requestBody = json.loads(event[EVENT_BODY])
	quizID = requestBody[REQUEST_QUIZID]
	attemptData = requestBody[REQUEST_ATTEMPTDATA]		

	results = tbl.query(
		IndexName = SORTKEY_INDEX,
		ProjectionExpression = PROJECTION_EXPRESSION,
		KeyConditionExpression = Key('SortKey').eq(quizID)
	)
    
    #remove wrong answers
	content = results[DB_QUERY_RECORD][0][ATTRIBUTE_CONTENT]
	for item in content:
		item.pop(ATTRIBUTE_QUESTION, None) #maybe remove this as you need to give this back for UI purposes 
		options = item[ATTRIBUTE_OPTIONS]
		options = [option for option in options if option[ATTRIBUTE_ISCORRECT] == True]
		item[ATTRIBUTE_OPTIONS] = options

	#remove isCorrect attribute
	for item in content:
		for option in item[ATTRIBUTE_OPTIONS]:
			option.pop(ATTRIBUTE_ISCORRECT, None)

	#validate
	for counter, item in enumerate(attemptData):
		pxtAnswers = item[ATTRIBUTE_ANSWERS]
		correctAnswers = content[counter][ATTRIBUTE_OPTIONS]

		for pxtAnswer in pxtAnswers:
			if any(correctAnswer[ATTRIBUTE_VALUE] == pxtAnswer[ATTRIBUTE_VALUE] for correctAnswer in correctAnswers):
				pxtAnswer[ATTRIBUTE_ISCORRECT] = True
			else:
				pxtAnswer[ATTRIBUTE_ISCORRECT] = False

		if any(pxtAnswer[ATTRIBUTE_ISCORRECT] == False for pxtAnswer in pxtAnswers):
			item[ATTRIBUTE_ISCORRECT] = False
		else:
			item[ATTRIBUTE_ISCORRECT] = True		


	correctAnswersCount = sum([1 for item in attemptData if item[ATTRIBUTE_ISCORRECT] == True])
	score = int((correctAnswersCount / len(attemptData)) * 100)
	requestBody[RESPONSE_SCORE] = score

	#insert response record
	firstName = requestBody[REQUEST_FIRSTNAME]
	lastName = requestBody[REQUEST_LASTNAME]
	age = requestBody[REQUEST_AGE]
	gender = requestBody[REQUEST_GENDER]

	tbl.put_item(
		Item = {
			'PartitionKey': quizID,
			'SortKey': RESPONDENT_FILTER + str(uuid.uuid4()).replace("-", ""),
			'FirstName': firstName,
			'LastName': lastName,
			'Age': age,
			'Gender': gender,
			'AttemptData': attemptData,
			'Score': score,
			'Status': STATUS_FILTER
		}
	)

	response = {
		RESPONSE_STATUSCODE: 200,
		RESPONSE_BODY: json.dumps(requestBody)
	}

	return response