import os
import decimal
import json
import boto3
import collections

from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
from collections import Counter

#load DB constants
DB = os.environ['DB']
DB_TABLE_QUIZAPPLICATION = os.environ['DB_TABLE_QUIZAPPLICATION']
DB_GETITEM_RECORD = os.environ['DB_GETITEM_RECORD']
DB_QUERY_RECORD = os.environ['DB_QUERY_RECORD']

#load EVENT constants
EVENT_BODY = os.environ['EVENT_BODY']
EVENT_PATHPARAMETERS = os.environ['EVENT_PATHPARAMETERS']
EVENT_QUERYSTRINGPARAMETERS = os.environ['EVENT_QUERYSTRINGPARAMETERS']

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
tbl = db.Table(DB_TABLE_QUIZAPPLICATION)

def handleRespondentStream(event, context):

	#load function constants
	ATTRIBUTE_RECORDS = os.environ['ATTRIBUTE_RECORDS']
	ATTRIBUTE_EVENTNAME = os.environ['ATTRIBUTE_EVENTNAME']
	ATTRIBUTE_DYNAMODB = os.environ['ATTRIBUTE_DYNAMODB']
	ATTRIBUTE_NEWIMAGE = os.environ['ATTRIBUTE_NEWIMAGE']
	ATTRIBUTE_QUIZOWNER = os.environ['ATTRIBUTE_QUIZOWNER']
	ATTRIBUTE_PARTITIONKEY = os.environ['ATTRIBUTE_PARTITIONKEY']
	ATTRIBUTE_SCORE = os.environ['ATTRIBUTE_SCORE']
	ATTRIBUTE_AGE = os.environ['ATTRIBUTE_AGE']
	ATTRIBUTE_GENDER = os.environ['ATTRIBUTE_GENDER']
	EVENT_INSERT = os.environ['EVENT_INSERT']
	CONDITION_EXPRESSION = os.environ['CONDITION_EXPRESSION']

	try:
		for record in event[ATTRIBUTE_RECORDS]:
			if record[ATTRIBUTE_EVENTNAME] == EVENT_INSERT:
				updateQuizAggregation(record[ATTRIBUTE_DYNAMODB][ATTRIBUTE_NEWIMAGE], 
					ATTRIBUTE_QUIZOWNER, ATTRIBUTE_PARTITIONKEY, ATTRIBUTE_SCORE, 
					ATTRIBUTE_AGE, ATTRIBUTE_GENDER, CONDITION_EXPRESSION)
				updateQuestionAggregation(record[ATTRIBUTE_DYNAMODB][ATTRIBUTE_NEWIMAGE],
					ATTRIBUTE_PARTITIONKEY, ATTRIBUTE_AGE, ATTRIBUTE_GENDER, CONDITION_EXPRESSION)		

		print('-----------------------')
	except Exception as e:
		print(e)
		print('-----------------------')
		return "ERROR!"

def updateQuestionAggregation(insertedRecord, constPartitionKey, constAge, constGender, constCondExp):

	quizID = insertedRecord[constPartitionKey]['S']
	attemptData = insertedRecord['AttemptData']['L']
	age = insertedRecord[constAge]['N']
	gender = insertedRecord[constGender]['S']

	for questionAttempt in attemptData:
		
		questionID = questionAttempt['M']['questionID']['S']
		isCorrect = questionAttempt['M']['isCorrect']['BOOL']
		
		totalAttemptGenderAttr = determineTotalAttemptGenderAttribute(gender)
		totalAttemptAgeAttr = determineTotalAttemptAgeAttribute(int(age))

		if isCorrect:

			correctAttemptGenderAttr = determineCorrectAttemptGenderAttribute(gender)
			correctAttemptAgeAttr = determineCorrectAttemptAgeAttribute(int(age))

			updateExpression = "SET {} = {} + :tAttempt, {} = {} + :tAttempt, {} = {} + :tAttempt, {} = {} + :cAttempt, {} = {} + :cAttempt, {} = {} + :cAttempt".format(
				"TotalAttempt", "TotalAttempt", totalAttemptGenderAttr, totalAttemptGenderAttr, totalAttemptAgeAttr, totalAttemptAgeAttr,
				"CorrectAttempt", "CorrectAttempt", correctAttemptGenderAttr, correctAttemptGenderAttr, correctAttemptAgeAttr, correctAttemptAgeAttr)

			tbl.update_item(
				Key = {'PartitionKey': quizID, 'SortKey': questionID},
				UpdateExpression = updateExpression,
				ConditionExpression = constCondExp,
				ExpressionAttributeValues = {
						':partitionKey': quizID,
						':sortKey': questionID,
						':tAttempt': 1,
						':cAttempt': 1
					}        
			)

		else:
			updateExpression = "SET {} = {} + :tAttempt, {} = {} + :tAttempt, {} = {} + :tAttempt".format(
				"TotalAttempt", "TotalAttempt", totalAttemptGenderAttr, totalAttemptGenderAttr, totalAttemptAgeAttr, totalAttemptAgeAttr)

			tbl.update_item(
				Key = {'PartitionKey': quizID, 'SortKey': questionID},
				UpdateExpression = updateExpression,
				ConditionExpression = constCondExp,
				ExpressionAttributeValues = {
						':partitionKey': quizID,
						':sortKey': questionID,
						':tAttempt': 1
					}        
			)

def updateQuizAggregation(insertedRecord, constQuizOwner, constPartitionKey, constScore, constAge, constGender, constCondExp):

	quizOwner = insertedRecord[constQuizOwner]['S'] #S means string
	quizID = insertedRecord[constPartitionKey]['S']
	score = int(insertedRecord[constScore]['N']) #N means number
	age = insertedRecord[constAge]['N']
	gender = insertedRecord[constGender]['S']

	totalAttemptGenderAttr = determineTotalAttemptGenderAttribute(gender)
	totalAttemptAgeAttr = determineTotalAttemptAgeAttribute(int(age))
	totalScoreGenderAttr = determineTotalScoreGenderAttribute(gender)	
	totalScoreAgeAttr = determineTotalScoreAgeAttribute(int(age))	

	updateExpression = "SET {} = {} + :attempt, {} = {} + :attempt, {} = {} + :attempt, {} = {} + :score, {} = {} + :score, {} = {} + :score".format("TotalAttempt", "TotalAttempt", totalAttemptGenderAttr, totalAttemptGenderAttr, totalAttemptAgeAttr, totalAttemptAgeAttr, "TotalScore", "TotalScore", totalScoreGenderAttr, totalScoreGenderAttr, totalScoreAgeAttr, totalScoreAgeAttr)

	tbl.update_item(
		Key = {'PartitionKey': quizOwner, 'SortKey': quizID},
		UpdateExpression = updateExpression,
		ConditionExpression = constCondExp,
		ExpressionAttributeValues = {
				':partitionKey': quizOwner,
				':sortKey': quizID,
				':attempt': 1,
				':score': score
			}        
	)

def determineTotalScoreGenderAttribute(gender):

	if gender.lower().replace(" ", "") == "male":
		return "TotalScoreMale"
	elif gender.lower().replace(" ", "") == "female":
		return "TotalScoreFemale"
	else:
		return "TotalScoreOther"

def determineTotalAttemptGenderAttribute(gender):

	if gender.lower().replace(" ", "") == "male":
		return "TotalAttemptMale"
	elif gender.lower().replace(" ", "") == "female":
		return "TotalAttemptFemale"
	else:
		return "TotalAttemptOther"

def determineTotalScoreAgeAttribute(age):

	if age <= 10:
		return "TotalScore10Under"
	elif age >= 11 and age <= 20:
		return "TotalScore1120"
	elif age >= 21 and age <= 30:
		return "TotalScore2130"
	elif age >= 31 and age <= 40:
		return "TotalScore3140"
	elif age >= 41 and age <= 50:
		return "TotalScore4150"
	elif age >= 51 and age <= 60:
		return "TotalScore5160"
	else:
		return "TotalScore61Over"

def determineTotalAttemptAgeAttribute(age):

	if age <= 10:
		return "TotalAttempt10Under"
	elif age >= 11 and age <= 20:
		return "TotalAttempt1120"
	elif age >= 21 and age <= 30:
		return "TotalAttempt2130"
	elif age >= 31 and age <= 40:
		return "TotalAttempt3140"
	elif age >= 41 and age <= 50:
		return "TotalAttempt4150"
	elif age >= 51 and age <= 60:
		return "TotalAttempt5160"
	else:
		return "TotalAttempt61Over"

def determineCorrectAttemptGenderAttribute(gender):

	if gender.lower().replace(" ", "") == "male":
		return "CorrectAttemptMale"
	elif gender.lower().replace(" ", "") == "female":
		return "CorrectAttemptFemale"
	else:
		return "CorrectAttemptOther"

def determineCorrectAttemptAgeAttribute(age):

	if age <= 10:
		return "CorrectAttempt10Under"
	elif age >= 11 and age <= 20:
		return "CorrectAttempt1120"
	elif age >= 21 and age <= 30:
		return "CorrectAttempt2130"
	elif age >= 31 and age <= 40:
		return "CorrectAttempt3140"
	elif age >= 41 and age <= 50:
		return "CorrectAttempt4150"
	elif age >= 51 and age <= 60:
		return "CorrectAttempt5160"
	else:
		return "CorrectAttempt61Over"