import os
import json
import boto3
import uuid
import decimal
import collections

from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
from collections import Counter
from decimal import Decimal

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

def validateLogin(event, context):

	#load function constants
	REQUEST_USERNAME = os.environ['REQUEST_USERNAME']
	CURRENT_VERSION = os.environ['CURRENT_VERSION']
	PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
	REQUEST_PASSWORD = os.environ['REQUEST_PASSWORD']
	ATTRIBUTE_PARTITIONKEY = os.environ['ATTRIBUTE_PARTITIONKEY']
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
			results[DB_GETITEM_RECORD].pop(ATTRIBUTE_PASSWORD, None)
			response = {
				RESPONSE_STATUSCODE: STATUSCODE_200,
				RESPONSE_BODY: json.dumps(results[DB_GETITEM_RECORD]),
				RESPONSE_HEADERS: {
		            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
		            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
		        }
			}
		else:
			response = {
				RESPONSE_STATUSCODE: STATUSCODE_401,
				RESPONSE_HEADERS: {
		            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
		            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
		        }
			}	
	else:
		response = {
			RESPONSE_STATUSCODE: STATUSCODE_401,
			RESPONSE_HEADERS: {
	            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
	            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
	        }
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
		RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD]),
		RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
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
			RESPONSE_BODY: json.dumps({RESPONSE_QUIZID: quizID}),
			RESPONSE_HEADERS: {
	            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
	            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
	        }
		}
	except Exception as e:
		response = {    
			RESPONSE_STATUSCODE: STATUSCODE_500,
			RESPONSE_BODY: repr(e),
			RESPONSE_HEADERS: {
	            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
	            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
	        }
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
	isDemographicSelected = requestBody['isDemographicSelected']	
	
	try:        
		tbl.update_item(
			Key = {'PartitionKey': username, 'SortKey': quizID},
			UpdateExpression = UPDATE_EXPRESSION,
			ConditionExpression = CONDITION_EXPRESSION,
			ExpressionAttributeValues = {
					':title': title,
					':description': description,
					':content': content,
					':isDemographicSelected': isDemographicSelected,
					':partitionKey': username,
					':sortKey': quizID
				}        
		)

		response = {
			RESPONSE_STATUSCODE: STATUSCODE_200,
			RESPONSE_HEADERS: {
	            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
	            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
	        }
		}
	except:
		response = {    
			RESPONSE_STATUSCODE: STATUSCODE_500,
			RESPONSE_HEADERS: {
	            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
	            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
	        }
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
	reportFilter = event[EVENT_QUERYSTRINGPARAMETERS]["reportFilter"]

	results = tbl.get_item(
		Key = {'PartitionKey': username, 'SortKey': quizID},
		ProjectionExpression = PROJECTION_EXPRESSION
	)

	#check if item was retrieved
	title = results[DB_GETITEM_RECORD][ATTRIBUTE_TITLE]
	if title and not title.isspace():

		# get percentage gender
		percentTotal = getPercentage(results[DB_GETITEM_RECORD]['TotalScore'], results[DB_GETITEM_RECORD]['TotalAttempt'])
		percentMale = getPercentage(results[DB_GETITEM_RECORD]['TotalScoreMale'], results[DB_GETITEM_RECORD]['TotalAttemptMale'])
		percentFemale = getPercentage(results[DB_GETITEM_RECORD]['TotalScoreFemale'], results[DB_GETITEM_RECORD]['TotalAttemptFemale'])
		percentOther = getPercentage(results[DB_GETITEM_RECORD]['TotalScoreOther'], results[DB_GETITEM_RECORD]['TotalAttemptOther'])

		results[DB_GETITEM_RECORD].pop("TotalScore", None)
		results[DB_GETITEM_RECORD].pop("TotalScoreMale", None)
		results[DB_GETITEM_RECORD].pop("TotalScoreFemale", None)
		results[DB_GETITEM_RECORD].pop("TotalScoreOther", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt", None)
		results[DB_GETITEM_RECORD].pop("TotalAttemptMale", None)
		results[DB_GETITEM_RECORD].pop("TotalAttemptFemale", None)
		results[DB_GETITEM_RECORD].pop("TotalAttemptOther", None)		

		#get percentage age
		percent10Under = getPercentage(results[DB_GETITEM_RECORD]['TotalScore10Under'], results[DB_GETITEM_RECORD]['TotalAttempt10Under'])
		percentTotal1120 = getPercentage(results[DB_GETITEM_RECORD]['TotalScore1120'], results[DB_GETITEM_RECORD]['TotalAttempt1120'])
		percentTotal2130 = getPercentage(results[DB_GETITEM_RECORD]['TotalScore2130'], results[DB_GETITEM_RECORD]['TotalAttempt2130'])
		percentTotal3140 = getPercentage(results[DB_GETITEM_RECORD]['TotalScore3140'], results[DB_GETITEM_RECORD]['TotalAttempt3140'])
		percentTotal4150 = getPercentage(results[DB_GETITEM_RECORD]['TotalScore4150'], results[DB_GETITEM_RECORD]['TotalAttempt4150'])
		percentTotal5160 = getPercentage(results[DB_GETITEM_RECORD]['TotalScore5160'], results[DB_GETITEM_RECORD]['TotalAttempt5160'])
		percentTotal61Over = getPercentage(results[DB_GETITEM_RECORD]['TotalScore61Over'], results[DB_GETITEM_RECORD]['TotalAttempt61Over'])

		results[DB_GETITEM_RECORD].pop("TotalScore10Under", None)
		results[DB_GETITEM_RECORD].pop("TotalScore1120", None)
		results[DB_GETITEM_RECORD].pop("TotalScore2130", None)
		results[DB_GETITEM_RECORD].pop("TotalScore3140", None)
		results[DB_GETITEM_RECORD].pop("TotalScore4150", None)
		results[DB_GETITEM_RECORD].pop("TotalScore5160", None)
		results[DB_GETITEM_RECORD].pop("TotalScore61Over", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt10Under", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt1120", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt2130", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt3140", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt4150", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt5160", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt61Over", None)

		#formulate json response
		if reportFilter.lower().replace(" ", "") == "age":
			results[DB_GETITEM_RECORD]['Percent10Under'] = percent10Under
			results[DB_GETITEM_RECORD]['Percent1120'] = percentTotal1120
			results[DB_GETITEM_RECORD]['Percent2130'] = percentTotal2130
			results[DB_GETITEM_RECORD]['Percent3140'] = percentTotal3140
			results[DB_GETITEM_RECORD]['Percent4150'] = percentTotal4150
			results[DB_GETITEM_RECORD]['Percent5160'] = percentTotal5160
			results[DB_GETITEM_RECORD]['Percent61Over'] = percentTotal61Over
			# results[DB_GETITEM_RECORD]['PercentTotal'] = "none"
			results[DB_GETITEM_RECORD]['PercentMale'] = "none"
			results[DB_GETITEM_RECORD]['PercentFemale'] = "none"
			results[DB_GETITEM_RECORD]['PercentOther'] = "none"	
		elif reportFilter.lower().replace(" ", "") == "gender":
			results[DB_GETITEM_RECORD]['Percent10Under'] = "none"
			results[DB_GETITEM_RECORD]['Percent1120'] = "none"
			results[DB_GETITEM_RECORD]['Percent2130'] = "none"
			results[DB_GETITEM_RECORD]['Percent3140'] = "none"
			results[DB_GETITEM_RECORD]['Percent4150'] = "none"
			results[DB_GETITEM_RECORD]['Percent5160'] = "none"
			results[DB_GETITEM_RECORD]['Percent61Over'] = "none"		
			# results[DB_GETITEM_RECORD]['PercentTotal'] = percentTotal
			results[DB_GETITEM_RECORD]['PercentMale'] = percentMale
			results[DB_GETITEM_RECORD]['PercentFemale'] = percentFemale
			results[DB_GETITEM_RECORD]['PercentOther'] = percentOther	

		response = {
			RESPONSE_STATUSCODE: STATUSCODE_200,
			RESPONSE_BODY: json.dumps(results[DB_GETITEM_RECORD], default=convertDecimalToInt),
			RESPONSE_HEADERS: {
	            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
	            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
	        }
		}
	else:
		response = {
			RESPONSE_STATUSCODE: STATUSCODE_404,
			RESPONSE_HEADERS: {
	            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
	            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
	        }
		}

	return response

def getQuestionDetails(event, context):

	quizID = event[EVENT_PATHPARAMETERS]['quizID']
	questionID = event[EVENT_PATHPARAMETERS]['questionID']
	reportFilter = event[EVENT_QUERYSTRINGPARAMETERS]["reportFilter"]

	results = tbl.get_item(
		Key = {'PartitionKey': quizID, 'SortKey': questionID},
		ProjectionExpression = "PartitionKey, TotalAttempt, TotalAttempt10Under, TotalAttempt1120, TotalAttempt2130, TotalAttempt3140, TotalAttempt4150, TotalAttempt5160, TotalAttempt61Over, TotalAttemptFemale, TotalAttemptMale, TotalAttemptOther, CorrectAttempt, CorrectAttempt10Under, CorrectAttempt1120, CorrectAttempt2130, CorrectAttempt3140, CorrectAttempt4150, CorrectAttempt5160, CorrectAttempt61Over, CorrectAttemptFemale, CorrectAttemptMale, CorrectAttemptOther"
	)

	#check if item was retrieved
	title = results[DB_GETITEM_RECORD]['PartitionKey']
	if title and not title.isspace():

		# get percentage gender
		percentTotal = getPercentageQuestion(results[DB_GETITEM_RECORD]['CorrectAttempt'], results[DB_GETITEM_RECORD]['TotalAttempt'])
		percentMale = getPercentageQuestion(results[DB_GETITEM_RECORD]['CorrectAttemptMale'], results[DB_GETITEM_RECORD]['TotalAttemptMale'])
		percentFemale = getPercentageQuestion(results[DB_GETITEM_RECORD]['CorrectAttemptFemale'], results[DB_GETITEM_RECORD]['TotalAttemptFemale'])
		percentOther = getPercentageQuestion(results[DB_GETITEM_RECORD]['CorrectAttemptOther'], results[DB_GETITEM_RECORD]['TotalAttemptOther'])
		
		results[DB_GETITEM_RECORD].pop("CorrectAttempt", None)
		results[DB_GETITEM_RECORD].pop("CorrectAttemptMale", None)
		results[DB_GETITEM_RECORD].pop("CorrectAttemptFemale", None)
		results[DB_GETITEM_RECORD].pop("CorrectAttemptOther", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt", None)
		results[DB_GETITEM_RECORD].pop("TotalAttemptMale", None)
		results[DB_GETITEM_RECORD].pop("TotalAttemptFemale", None)
		results[DB_GETITEM_RECORD].pop("TotalAttemptOther", None)				

		#get percentage age
		percent10Under = getPercentageQuestion(results[DB_GETITEM_RECORD]['CorrectAttempt10Under'], results[DB_GETITEM_RECORD]['TotalAttempt10Under'])
		percentTotal1120 = getPercentageQuestion(results[DB_GETITEM_RECORD]['CorrectAttempt1120'], results[DB_GETITEM_RECORD]['TotalAttempt1120'])
		percentTotal2130 = getPercentageQuestion(results[DB_GETITEM_RECORD]['CorrectAttempt2130'], results[DB_GETITEM_RECORD]['TotalAttempt2130'])
		percentTotal3140 = getPercentageQuestion(results[DB_GETITEM_RECORD]['CorrectAttempt3140'], results[DB_GETITEM_RECORD]['TotalAttempt3140'])
		percentTotal4150 = getPercentageQuestion(results[DB_GETITEM_RECORD]['CorrectAttempt4150'], results[DB_GETITEM_RECORD]['TotalAttempt4150'])
		percentTotal5160 = getPercentageQuestion(results[DB_GETITEM_RECORD]['CorrectAttempt5160'], results[DB_GETITEM_RECORD]['TotalAttempt5160'])
		percentTotal61Over = getPercentageQuestion(results[DB_GETITEM_RECORD]['CorrectAttempt61Over'], results[DB_GETITEM_RECORD]['TotalAttempt61Over'])

		results[DB_GETITEM_RECORD].pop("CorrectAttempt10Under", None)
		results[DB_GETITEM_RECORD].pop("CorrectAttempt1120", None)
		results[DB_GETITEM_RECORD].pop("CorrectAttempt2130", None)
		results[DB_GETITEM_RECORD].pop("CorrectAttempt3140", None)
		results[DB_GETITEM_RECORD].pop("CorrectAttempt4150", None)
		results[DB_GETITEM_RECORD].pop("CorrectAttempt5160", None)
		results[DB_GETITEM_RECORD].pop("CorrectAttempt61Over", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt10Under", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt1120", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt2130", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt3140", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt4150", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt5160", None)
		results[DB_GETITEM_RECORD].pop("TotalAttempt61Over", None)

		#formulate json response
		if reportFilter.lower().replace(" ", "") == "age":
			results[DB_GETITEM_RECORD]['Percent10Under'] = percent10Under
			results[DB_GETITEM_RECORD]['Percent1120'] = percentTotal1120
			results[DB_GETITEM_RECORD]['Percent2130'] = percentTotal2130
			results[DB_GETITEM_RECORD]['Percent3140'] = percentTotal3140
			results[DB_GETITEM_RECORD]['Percent4150'] = percentTotal4150
			results[DB_GETITEM_RECORD]['Percent5160'] = percentTotal5160
			results[DB_GETITEM_RECORD]['Percent61Over'] = percentTotal61Over
			# results[DB_GETITEM_RECORD]['PercentTotal'] = "none"
			results[DB_GETITEM_RECORD]['PercentMale'] = "none"
			results[DB_GETITEM_RECORD]['PercentFemale'] = "none"
			results[DB_GETITEM_RECORD]['PercentOther'] = "none"	
		elif reportFilter.lower().replace(" ", "") == "gender":
			results[DB_GETITEM_RECORD]['Percent10Under'] = "none"
			results[DB_GETITEM_RECORD]['Percent1120'] = "none"
			results[DB_GETITEM_RECORD]['Percent2130'] = "none"
			results[DB_GETITEM_RECORD]['Percent3140'] = "none"
			results[DB_GETITEM_RECORD]['Percent4150'] = "none"
			results[DB_GETITEM_RECORD]['Percent5160'] = "none"
			results[DB_GETITEM_RECORD]['Percent61Over'] = "none"		
			# results[DB_GETITEM_RECORD]['PercentTotal'] = percentTotal
			results[DB_GETITEM_RECORD]['PercentMale'] = percentMale
			results[DB_GETITEM_RECORD]['PercentFemale'] = percentFemale
			results[DB_GETITEM_RECORD]['PercentOther'] = percentOther

		response = {
			RESPONSE_STATUSCODE: STATUSCODE_200,
			RESPONSE_BODY: json.dumps(results[DB_GETITEM_RECORD], default=convertDecimalToInt),
			RESPONSE_HEADERS: {
	            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
	            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
	        }
		}

	else:
		response = {
			RESPONSE_STATUSCODE: STATUSCODE_404,
			RESPONSE_HEADERS: {
	            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
	            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
	        }
		}

	return response

def getQuizQuestions(event, context):

	#load function constants
	REQUEST_USERNAME = os.environ['REQUEST_USERNAME']
	REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
	PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
	ATTRIBUTE_TITLE = os.environ['ATTRIBUTE_TITLE']
	ATTRIBUTE_CONTENT = os.environ['ATTRIBUTE_CONTENT']

	username = event[EVENT_PATHPARAMETERS][REQUEST_USERNAME]
	quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]	

	results = tbl.get_item(
		Key = {'PartitionKey': username, 'SortKey': quizID},
		ProjectionExpression = PROJECTION_EXPRESSION
	)

	#check if item was retrieved
	title = results[DB_GETITEM_RECORD][ATTRIBUTE_TITLE]

	if title and not title.isspace():
		
		content = results[DB_GETITEM_RECORD][ATTRIBUTE_CONTENT]
		for item in content:
			item.pop("options", None)
			item.pop("type", None)

		response = {
			RESPONSE_STATUSCODE: STATUSCODE_200,
			RESPONSE_BODY: json.dumps(content),
			RESPONSE_HEADERS: {
	            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
	            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
	        }
		}
	else:
		response = {
			RESPONSE_STATUSCODE: STATUSCODE_404,
			RESPONSE_HEADERS: {
	            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
	            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
	        }
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
	accessLink = "localhost:4200/participant/{}".format(quizID)	

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
					':sortKey': quizID,
					':totalAttempt': 0,
					':totalAttemptMale': 0,
					':totalAttemptFemale': 0,
					':totalAttemptOther': 0,
					':totalAttempt10Under': 0,
					':totalAttempt1120': 0,
					':totalAttempt2130': 0,
					':totalAttempt3140': 0,
					':totalAttempt4150': 0,
					':totalAttempt5160': 0,
					':totalAttempt61Over': 0,
					':totalScore': 0,
					':totalScoreMale': 0,
					':totalScoreFemale': 0,
					':totalScoreOther': 0,
					':totalScore10Under': 0,
					':totalScore1120': 0,
					':totalScore2130': 0,
					':totalScore3140': 0,
					':totalScore4150': 0,
					':totalScore5160': 0,
					':totalScore61Over': 0
				}        
		)		

		#add an item per question for aggregation purposes
		with tbl.batch_writer() as batch:
			for item in content:
				batch.put_item(
					Item = {
						'PartitionKey': quizID,
						'SortKey': item[ATTRIBUTE_QUESTIONID],
						'TotalAttempt': 0,
						'TotalAttemptMale': 0,
						'TotalAttemptFemale': 0,
						'TotalAttemptOther': 0,
						'TotalAttempt10Under': 0,
						'TotalAttempt1120': 0,
						'TotalAttempt2130': 0,
						'TotalAttempt3140': 0,
						'TotalAttempt4150': 0,
						'TotalAttempt5160': 0,
						'TotalAttempt61Over': 0,
						'CorrectAttempt': 0,
						'CorrectAttemptMale': 0,
						'CorrectAttemptFemale': 0,
						'CorrectAttemptOther': 0,
						'CorrectAttempt10Under': 0,
						'CorrectAttempt1120': 0,
						'CorrectAttempt2130': 0,
						'CorrectAttempt3140': 0,
						'CorrectAttempt4150': 0,
						'CorrectAttempt5160': 0,
						'CorrectAttempt61Over': 0
					}
				)

		response = {
			RESPONSE_STATUSCODE: STATUSCODE_200,
			RESPONSE_HEADERS: {
	            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
	            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
	        }
		}
	except:
		response = {    
			RESPONSE_STATUSCODE: STATUSCODE_500,
			RESPONSE_HEADERS: {
	            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
	            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
	        }
		}	

	return response

# private functions
def convertDecimalToInt(obj):
    if isinstance(obj, decimal.Decimal):
        return int(obj)
    raise TypeError

def getPercentage(dividend, divisor):
	if int(divisor) == 0:
		return "none"
	else:
		return str(int(int(dividend) / int(divisor)))

def getPercentageQuestion(dividend, divisor):
	if int(divisor) == 0:
		return "none"
	else:
		return str(int(Decimal(dividend) / Decimal(divisor) * 100))