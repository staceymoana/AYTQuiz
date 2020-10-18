import os
import json
import boto3
import uuid
import decimal
import collections

from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
from collections import Counter

#load DB constants
DB = os.environ['DB']
DB_TABLE = os.environ['DB_TABLE']
DB_GETITEM_RECORD = os.environ['DB_GETITEM_RECORD']
DB_QUERY_RECORD = os.environ['DB_QUERY_RECORD']

#load EVENT constants
EVENT_BODY = os.environ['EVENT_BODY']
EVENT_PATHPARAMETERS = os.environ['EVENT_PATHPARAMETERS']
EVENT_QUERYSTRINGPARAMETERS = os.environ['EVENT_QUERYSTRINGPARAMETERS']

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

def validateLogin(event, context):

	#load function constants
	REQUEST_USERNAME = os.environ['REQUEST_USERNAME']
	CURRENT_VERSION = os.environ['CURRENT_VERSION']
	PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
	REQUEST_PASSWORD = os.environ['REQUEST_PASSWORD']
	ATTRIBUTE_PASSWORD = os.environ['ATTRIBUTE_PASSWORD']

	requestBody = json.loads(event[EVENT_BODY])
	username = requestBody[REQUEST_USERNAME]

	results = tbl.get_item(
		Key = {'PartitionKey': username, 'SortKey': CURRENT_VERSION},
		ProjectionExpression = PROJECTION_EXPRESSION
	)

	if DB_GETITEM_RECORD in results:
		#TODO: needs some argon2 encryption/decryption if time permits		
		requestPassword = requestBody[REQUEST_PASSWORD]
		savedPassword = results[DB_GETITEM_RECORD][ATTRIBUTE_PASSWORD]

		if requestPassword == savedPassword:
			response = {
				RESPONSE_STATUSCODE: STATUSCODE_200
			}
		else:
			response = {
				RESPONSE_STATUSCODE: STATUSCODE_401
			}	
	else:
		response = {
			RESPONSE_STATUSCODE: STATUSCODE_401
		}

	return response

def getQuizzes(event, context):

	#load function constants
	REQUEST_USERNAME = os.environ['REQUEST_USERNAME']
	REQUEST_ISPUBLISHED = os.environ['REQUEST_ISPUBLISHED']
	PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
	QUIZ_FILTER = os.environ['QUIZ_FILTER']

	username = event[EVENT_PATHPARAMETERS][REQUEST_USERNAME]
	isPublished = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_ISPUBLISHED]

	if isPublished == "True":
		isPublished = True
	else:
		isPublished = False

	results = tbl.query(
		ProjectionExpression = PROJECTION_EXPRESSION,
		KeyConditionExpression = Key('PartitionKey').eq(username) & Key('SortKey').begins_with(QUIZ_FILTER),
		FilterExpression = Attr('IsPublished').eq(isPublished)
	)

	response = {
		RESPONSE_STATUSCODE: STATUSCODE_200,
		RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD])
	}

	return response

def getQuizRespondents(event, context):

	#load function constants
	REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
	PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
	RESPONDENT_FILTER = os.environ['RESPONDENT_FILTER']
	STATUS_FILTER = os.environ['STATUS_FILTER']
	JSONKEY_SCORE = os.environ['JSONKEY_SCORE']
	JSONVALUE_COUNT = os.environ['JSONVALUE_COUNT']

	quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]	

	results = tbl.query(
		ProjectionExpression = PROJECTION_EXPRESSION,
		KeyConditionExpression = Key('PartitionKey').eq(quizID) & Key('SortKey').begins_with(RESPONDENT_FILTER),
		FilterExpression = Attr('Status').eq(STATUS_FILTER)
	)

	aggregatedResults = Counter(str(int(item[JSONKEY_SCORE])) for item in results[DB_QUERY_RECORD])
	formattedResults = [{JSONKEY_SCORE: score, JSONVALUE_COUNT: count} for score,count in aggregatedResults.items()]

	response = {
		RESPONSE_STATUSCODE: STATUSCODE_200,
		RESPONSE_BODY: json.dumps(formattedResults)
	}

	return response

def createQuiz(event, context):

	#load function constants
	REQUEST_USERNAME = os.environ['REQUEST_USERNAME']
	REQUEST_TITLE = os.environ['REQUEST_TITLE']
	REQUEST_DESCRIPTION = os.environ['REQUEST_DESCRIPTION']
	QUIZ_FILTER = os.environ['QUIZ_FILTER']
	RESPONSE_QUIZID = os.environ['RESPONSE_QUIZID']

	requestBody = json.loads(event[EVENT_BODY])
	username = event[EVENT_PATHPARAMETERS][REQUEST_USERNAME]
	title = requestBody[REQUEST_TITLE]
	description = requestBody[REQUEST_DESCRIPTION]
	quizID = QUIZ_FILTER + str(uuid.uuid4()).replace("-", "")

	try:        
		tbl.put_item(
			Item = {
				'PartitionKey': username,
				'SortKey': quizID,
				'Title': title,
				'Description': description,
				'IsPublished': False
			}
		)

		response = {
			RESPONSE_STATUSCODE: STATUSCODE_200,
			RESPONSE_BODY: json.dumps({RESPONSE_QUIZID: quizID})
		}
	except Exception as e:
		response = {    
			RESPONSE_STATUSCODE: STATUSCODE_500,
			RESPONSE_BODY: repr(e)
		}

	return response

def updateQuiz(event, context):

	#load function constants
	REQUEST_USERNAME = os.environ['REQUEST_USERNAME']
	REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
	REQUEST_TITLE = os.environ['REQUEST_TITLE']
	REQUEST_DESCRIPTION = os.environ['REQUEST_DESCRIPTION']
	REQUEST_CONTENT = os.environ['REQUEST_CONTENT']
	UPDATE_EXPRESSION = os.environ['UPDATE_EXPRESSION']
	CONDITION_EXPRESSION = os.environ['CONDITION_EXPRESSION']

	requestBody = json.loads(event[EVENT_BODY])
	username = event[EVENT_PATHPARAMETERS][REQUEST_USERNAME]
	quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
	title = requestBody[REQUEST_TITLE]
	description = requestBody[REQUEST_DESCRIPTION]
	content = requestBody[REQUEST_CONTENT]	
	
	try:        
		tbl.update_item(
			Key = {'PartitionKey': username, 'SortKey': quizID},
			UpdateExpression = UPDATE_EXPRESSION,
			ConditionExpression = CONDITION_EXPRESSION,
			ExpressionAttributeValues = {
					':title': title,
					':description': description,
					':content': content,
					':partitionKey': username,
					':sortKey': quizID
				}        
		)

		response = {
			RESPONSE_STATUSCODE: STATUSCODE_200
		}
	except:
		response = {    
			RESPONSE_STATUSCODE: STATUSCODE_500,
		}

	return response

def getQuizDetails(event, context):

	#load function constants
	REQUEST_USERNAME = os.environ['REQUEST_USERNAME']
	REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
	PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
	ATTRIBUTE_TITLE = os.environ['ATTRIBUTE_TITLE']

	username = event[EVENT_PATHPARAMETERS][REQUEST_USERNAME]
	quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]	

	results = tbl.get_item(
		Key = {'PartitionKey': username, 'SortKey': quizID},
		ProjectionExpression = PROJECTION_EXPRESSION
	)

	#check if item was retrieved
	title = results[DB_GETITEM_RECORD][ATTRIBUTE_TITLE]
	if title and not title.isspace():
		response = {
			RESPONSE_STATUSCODE: STATUSCODE_200,
			RESPONSE_BODY: json.dumps(results[DB_GETITEM_RECORD])
		}
	else:
		response = {
			RESPONSE_STATUSCODE: STATUSCODE_404
		}

	return response

def publishQuiz(event, context):

	#load function constants
	REQUEST_USERNAME = os.environ['REQUEST_USERNAME']
	REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
	PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
	ATTRIBUTE_CONTENT = os.environ['ATTRIBUTE_CONTENT']
	ATTRIBUTE_QUESTIONID = os.environ['ATTRIBUTE_QUESTIONID']
	QUESTION_FILTER = os.environ['QUESTION_FILTER']
	UPDATE_EXPRESSION = os.environ['UPDATE_EXPRESSION']
	CONDITION_EXPRESSION = os.environ['CONDITION_EXPRESSION']

	username = event[EVENT_PATHPARAMETERS][REQUEST_USERNAME]
	quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]	

	results = tbl.get_item(
		Key = {'PartitionKey': username, 'SortKey': quizID},
		ProjectionExpression = PROJECTION_EXPRESSION
	)

	content = results[DB_GETITEM_RECORD][ATTRIBUTE_CONTENT]
	for item in content:
		item[ATTRIBUTE_QUESTIONID] = QUESTION_FILTER + str(uuid.uuid4()).replace("-", "")

	#add url as new attribute to the quiz, need to add actual logic here to produce URL
	accessLink = ""	

	try:
		#this should have a retry in case it fails (atomicity)
		tbl.update_item(
			Key = {'PartitionKey': username, 'SortKey': quizID},
			UpdateExpression = UPDATE_EXPRESSION,
			ConditionExpression = CONDITION_EXPRESSION,
			ExpressionAttributeValues = {
					':content': content,
					':accessLink': accessLink,
					':isPublished': True,
					':partitionKey': username,
					':sortKey': quizID
				}        
		)		

		#add an item per question for aggregation purposes
		with tbl.batch_writer() as batch:
			for item in content:
				batch.put_item(
					Item = {
						'PartitionKey': quizID,
						'SortKey': item[ATTRIBUTE_QUESTIONID]
					}
				)

		response = {
			RESPONSE_STATUSCODE: STATUSCODE_200
		}
	except:
		response = {    
			RESPONSE_STATUSCODE: STATUSCODE_500
		}	

	return response

# private functions
def convertNumbersToDecimal(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError