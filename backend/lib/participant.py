import os
import json
import boto3
import uuid

from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr

#load DB constants
DB = os.environ['DB']
DB_TABLE_QUIZAPPLICATION = os.environ['DB_TABLE_QUIZAPPLICATION']
DB_TABLE_RESPONDENTS = os.environ['DB_TABLE_RESPONDENTS']
DB_QUERY_RECORD = os.environ['DB_QUERY_RECORD']

#load EVENT constants
EVENT_BODY = os.environ['EVENT_BODY']
EVENT_PATHPARAMETERS = os.environ['EVENT_PATHPARAMETERS']

#load RESPONSE constants
RESPONSE_STATUSCODE = os.environ['RESPONSE_STATUSCODE']
RESPONSE_BODY = os.environ['RESPONSE_BODY']
RESPONSE_HEADERS = os.environ['RESPONSE_HEADERS']
ACCESS_CONTROL_ALLOW_ORIGIN = os.environ['ACCESS_CONTROL_ALLOW_ORIGIN']
ACCESS_CONTROL_ALLOW_CREDENTIALS = os.environ['ACCESS_CONTROL_ALLOW_CREDENTIALS']

#load STATUSCODE constants
STATUSCODE_200 = os.environ['STATUSCODE_200']
STATUSCODE_401 = os.environ['STATUSCODE_401']
STATUSCODE_404 = os.environ['STATUSCODE_404']
STATUSCODE_500 = os.environ['STATUSCODE_500']

#instantiate DynamoDB objects
db = boto3.resource(DB)
tblQuizApplication = db.Table(DB_TABLE_QUIZAPPLICATION)
tblRespondents = db.Table(DB_TABLE_RESPONDENTS)

def getQuizDetailsPxt(event, context):

	#load function constants
	REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
	INDEX = os.environ['INDEX']
	PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']

	quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]

	results = tblQuizApplication.query(
		IndexName = INDEX,
		ProjectionExpression = PROJECTION_EXPRESSION,
		KeyConditionExpression = Key('SortKey').eq(quizID)
	)

	response = {
		RESPONSE_STATUSCODE: STATUSCODE_200,
		RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD][0]),
		RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
	}

	return response

def submitQuizAttempt(event, context):

	#load function constants
	REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
	REQUEST_ATTEMPTDATA = os.environ['REQUEST_ATTEMPTDATA']
	REQUEST_FIRSTNAME = os.environ['REQUEST_FIRSTNAME']
	REQUEST_LASTNAME = os.environ['REQUEST_LASTNAME']
	REQUEST_AGE = os.environ['REQUEST_AGE']
	REQUEST_GENDER = os.environ['REQUEST_GENDER']
	INDEX = os.environ['INDEX']
	PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
	ATTRIBUTE_CONTENT = os.environ['ATTRIBUTE_CONTENT']
	ATTRIBUTE_QUESTION = os.environ['ATTRIBUTE_QUESTION']
	ATTRIBUTE_OPTIONS = os.environ['ATTRIBUTE_OPTIONS']
	ATTRIBUTE_ISCORRECT = os.environ['ATTRIBUTE_ISCORRECT']
	ATTRIBUTE_ANSWERS = os.environ['ATTRIBUTE_ANSWERS']
	ATTRIBUTE_VALUE = os.environ['ATTRIBUTE_VALUE']
	ATTRIBUTE_QUESTIONID = os.environ['ATTRIBUTE_QUESTIONID']
	ATTRIBUTE_PARTITIONKEY = os.environ['ATTRIBUTE_PARTITIONKEY']	
	RESPONDENT_FILTER = os.environ['RESPONDENT_FILTER']
	STATUS_FILTER = os.environ['STATUS_FILTER']
	RESPONSE_SCORE = os.environ['RESPONSE_SCORE']

	requestBody = json.loads(event[EVENT_BODY])
	quizID = requestBody[REQUEST_QUIZID]
	attemptData = requestBody[REQUEST_ATTEMPTDATA]		

	results = tblQuizApplication.query(
		IndexName = INDEX,
		ProjectionExpression = PROJECTION_EXPRESSION,
		KeyConditionExpression = Key('SortKey').eq(quizID)
	)
    
	#get the quiz owner
	quizOwner = results[DB_QUERY_RECORD][0][ATTRIBUTE_PARTITIONKEY]

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

		# handles empty answers
		if not pxtAnswers:
			item[ATTRIBUTE_ISCORRECT] = False

		else:
			correctAnswers = content[counter][ATTRIBUTE_OPTIONS]

			for pxtAnswer in pxtAnswers:
				if any(correctAnswer[ATTRIBUTE_VALUE] == pxtAnswer[ATTRIBUTE_VALUE] for correctAnswer in correctAnswers):
					pxtAnswer[ATTRIBUTE_ISCORRECT] = True
				else:
					pxtAnswer[ATTRIBUTE_ISCORRECT] = False

			pxtCorAnswerCount = sum([1 for item in pxtAnswers if item[ATTRIBUTE_ISCORRECT] == True])

			if any(pxtAnswer[ATTRIBUTE_ISCORRECT] == False for pxtAnswer in pxtAnswers):
				item[ATTRIBUTE_ISCORRECT] = False
			elif len(correctAnswers) != pxtCorAnswerCount:
				item[ATTRIBUTE_ISCORRECT] = False
			else:
				item[ATTRIBUTE_ISCORRECT] = True

		item[ATTRIBUTE_QUESTIONID] = content[counter][ATTRIBUTE_QUESTIONID]

	correctAnswersCount = sum([1 for item in attemptData if item[ATTRIBUTE_ISCORRECT] == True])
	score = int((correctAnswersCount / len(attemptData)) * 100)
	requestBody[RESPONSE_SCORE] = score

	#insert response record
	firstName = requestBody[REQUEST_FIRSTNAME]
	lastName = requestBody[REQUEST_LASTNAME]
	age = requestBody[REQUEST_AGE] 
	gender = requestBody[REQUEST_GENDER]

	quizAge = quizID + '#' + str(age).replace(" ", "")
	quizGender = quizID + '#' + gender.lower().replace(" ", "")
	quizFirstName = quizID + '#' + firstName.lower().replace(" ", "")
	quizLastName = quizID + '#' + lastName.lower().replace(" ", "")
	quizAgeGender = quizID + '#' + str(age).replace(" ", "") + '#' + gender.lower().replace(" ", "")
	quizAgeFirstName = quizID + '#' + str(age).replace(" ", "") + '#' + firstName.lower().replace(" ", "")
	quizAgeLastName = quizID + '#' + str(age).replace(" ", "") + '#' + lastName.lower().replace(" ", "")
	quizGenderFirstName = quizID + '#' + gender.lower().replace(" ", "") + '#' + firstName.lower().replace(" ", "")
	quizGenderLastName = quizID + '#' + gender.lower().replace(" ", "") + '#' + lastName.lower().replace(" ", "")
	quizFirstNameLastName = quizID + '#' + firstName.lower().replace(" ", "") + '#' + lastName.lower().replace(" ", "")
	quizAgeGenderFirstName = quizID + '#' + str(age).replace(" ", "") + '#' + gender.lower().replace(" ", "") + '#' + firstName.lower().replace(" ", "")
	quizAgeGenderLastName = quizID + '#' + str(age).replace(" ", "") + '#' + gender.lower().replace(" ", "") + '#' + lastName.lower().replace(" ", "")
	quizAgeFirstNameLastName = quizID + '#' + str(age).replace(" ", "") + '#' + firstName.lower().replace(" ", "") + '#' + lastName.lower().replace(" ", "")
	quizGenderFirstNameLastName = quizID + '#' + gender.lower().replace(" ", "") + '#' + firstName.lower().replace(" ", "") + '#' + lastName.lower().replace(" ", "")
	quizAgeGenderFirstNameLastName = quizID + '#' + str(age).replace(" ", "") + '#' + gender.lower().replace(" ", "") + '#' + firstName.lower().replace(" ", "") + '#' + lastName.lower().replace(" ", "")

	tblRespondents.put_item(
		Item = {
			'PartitionKey': quizID,
			'SortKey': RESPONDENT_FILTER + str(uuid.uuid4()).replace("-", ""),
			'QuizOwner': quizOwner,
			'FirstName': firstName,
			'LastName': lastName,
			'Age': age,
			'Gender': gender,
			'AttemptData': attemptData,
			'Score': score,
			'Status': STATUS_FILTER,
			'QuizAge': quizAge,
			'QuizGender': quizGender,
			'QuizFirstName': quizFirstName,
			'QuizLastName': quizLastName,
			'QuizAgeGender': quizAgeGender,
			'QuizAgeFirstName': quizAgeFirstName,
			'QuizAgeLastName': quizAgeLastName,
			'QuizGenderFirstName': quizGenderFirstName,
			'QuizGenderLastName': quizGenderLastName,
			'QuizFirstNameLastName': quizFirstNameLastName,
			'QuizAgeGenderFirstName': quizAgeGenderFirstName,
			'QuizAgeGenderLastName': quizAgeGenderLastName,
			'QuizAgeFirstNameLastName': quizAgeFirstNameLastName,
			'QuizGenderFirstNameLastName': quizGenderFirstNameLastName,
			'QuizAgeGenderFirstNameLastName': quizAgeGenderFirstNameLastName
		}
	)

	response = {
		RESPONSE_STATUSCODE: STATUSCODE_200,
		RESPONSE_BODY: json.dumps(requestBody),
		RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
	}

	return response