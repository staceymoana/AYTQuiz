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
DB_TABLE_RESPONDENTS = os.environ['DB_TABLE_RESPONDENTS']
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
tblQuizApplication = db.Table(DB_TABLE_RESPONDENTS)

def getQuizRespondents(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    RESPONDENT_FILTER = os.environ['RESPONDENT_FILTER']
    STATUS_FILTER = os.environ['STATUS_FILTER']
    JSONKEY_SCORE = os.environ['JSONKEY_SCORE']
    JSONVALUE_COUNT = os.environ['JSONVALUE_COUNT']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]    

    results = tblQuizApplication.query(
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('PartitionKey').eq(quizID) & Key('SortKey').begins_with(RESPONDENT_FILTER),
        FilterExpression = Attr('Status').eq(STATUS_FILTER)
    )

    aggregatedResults = Counter(str(int(item[JSONKEY_SCORE])) for item in results[DB_QUERY_RECORD])
    formattedResults = [{JSONKEY_SCORE: score, JSONVALUE_COUNT: count} for score,count in aggregatedResults.items()]

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        # RESPONSE_BODY: json.dumps(formattedResults),
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByAge(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_AGE = os.environ['REQUEST_AGE']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    age = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_AGE]

    partitionKey = quizID + "#" + str(age).replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizAge').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByGender(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_GENDER = os.environ['REQUEST_GENDER']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    gender = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_GENDER]

    partitionKey = quizID + "#" + gender.lower().replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizGender').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByFirstName(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_FIRSTNAME = os.environ['REQUEST_FIRSTNAME']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    firstName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_FIRSTNAME]

    partitionKey = quizID + "#" + firstName.lower().replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizFirstName').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByLastName(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_LASTNAME = os.environ['REQUEST_LASTNAME']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    lastName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_LASTNAME]

    partitionKey = quizID + "#" + lastName.lower().replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizLastName').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByAgeGender(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_AGE = os.environ['REQUEST_AGE']
    REQUEST_GENDER = os.environ['REQUEST_GENDER']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    age = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_AGE]
    gender = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_GENDER]

    partitionKey = quizID + "#" + str(age).replace(" ", "") + "#" + gender.lower().replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizAgeGender').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByAgeFirstName(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_AGE = os.environ['REQUEST_AGE']
    REQUEST_FIRSTNAME = os.environ['REQUEST_FIRSTNAME']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    age = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_AGE]
    firstName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_FIRSTNAME]

    partitionKey = quizID + "#" + str(age).replace(" ", "") + "#" + firstName.lower().replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizAgeFirstName').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByAgeLastName(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_AGE = os.environ['REQUEST_AGE']
    REQUEST_LASTNAME = os.environ['REQUEST_LASTNAME']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    age = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_AGE]
    lastName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_LASTNAME]

    partitionKey = quizID + "#" + str(age).replace(" ", "") + "#" + lastName.lower().replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizAgeLastName').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByGenderFirstName(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_GENDER = os.environ['REQUEST_GENDER']
    REQUEST_FIRSTNAME = os.environ['REQUEST_FIRSTNAME']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    gender = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_GENDER]
    firstName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_FIRSTNAME]

    partitionKey = quizID + "#" + gender.lower().replace(" ", "") + "#" + firstName.lower().replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizGenderFirstName').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByGenderLastName(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_GENDER = os.environ['REQUEST_GENDER']
    REQUEST_LASTNAME = os.environ['REQUEST_LASTNAME']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    gender = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_GENDER]
    lastName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_LASTNAME]

    partitionKey = quizID + "#" + gender.lower().replace(" ", "") + "#" + lastName.lower().replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizGenderLastName').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByFirstNameLastName(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_FIRSTNAME = os.environ['REQUEST_FIRSTNAME']
    REQUEST_LASTNAME = os.environ['REQUEST_LASTNAME']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    firstName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_FIRSTNAME]
    lastName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_LASTNAME]

    partitionKey = quizID + "#" + firstName.lower().replace(" ", "") + "#" + lastName.lower().replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizFirstNameLastName').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByAgeGenderFirstName(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_AGE = os.environ['REQUEST_AGE']
    REQUEST_GENDER = os.environ['REQUEST_GENDER']
    REQUEST_FIRSTNAME = os.environ['REQUEST_FIRSTNAME']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    age = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_AGE]
    gender = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_GENDER]
    firstName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_FIRSTNAME]

    partitionKey = quizID + "#" + str(age).replace(" ", "") + "#" + gender.lower().replace(" ", "") + "#" + firstName.lower().replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizAgeGenderFirstName').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByAgeGenderLastName(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_AGE = os.environ['REQUEST_AGE']
    REQUEST_GENDER = os.environ['REQUEST_GENDER']
    REQUEST_LASTNAME = os.environ['REQUEST_LASTNAME']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    age = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_AGE]
    gender = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_GENDER]
    lastName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_LASTNAME]

    partitionKey = quizID + "#" + str(age).replace(" ", "") + "#" + gender.lower().replace(" ", "") + "#" + lastName.lower().replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizAgeGenderLastName').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByAgeFirstNameLastName(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_AGE = os.environ['REQUEST_AGE']
    REQUEST_FIRSTNAME = os.environ['REQUEST_FIRSTNAME']
    REQUEST_LASTNAME = os.environ['REQUEST_LASTNAME']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    age = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_AGE]
    firstName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_FIRSTNAME]
    lastName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_LASTNAME]

    partitionKey = quizID + "#" + str(age).replace(" ", "") + "#" + firstName.lower().replace(" ", "") + "#" + lastName.lower().replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizAgeFirstNameLastName').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByGenderFirstNameLastName(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_GENDER = os.environ['REQUEST_GENDER']
    REQUEST_FIRSTNAME = os.environ['REQUEST_FIRSTNAME']
    REQUEST_LASTNAME = os.environ['REQUEST_LASTNAME']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    gender = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_GENDER]
    firstName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_FIRSTNAME]
    lastName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_LASTNAME]

    partitionKey = quizID + "#" + gender.lower().replace(" ", "") + "#" + firstName.lower().replace(" ", "") + "#" + lastName.lower().replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizGenderFirstNameLastName').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
        RESPONSE_HEADERS: {
            ACCESS_CONTROL_ALLOW_ORIGIN: '*',
            ACCESS_CONTROL_ALLOW_CREDENTIALS: True
        }
    }

    return response

def getLeaderboardByAgeGenderFirstNLastN(event, context):

    #load function constants
    REQUEST_QUIZID = os.environ['REQUEST_QUIZID']
    REQUEST_AGE = os.environ['REQUEST_AGE']
    REQUEST_GENDER = os.environ['REQUEST_GENDER']
    REQUEST_FIRSTNAME = os.environ['REQUEST_FIRSTNAME']
    REQUEST_LASTNAME = os.environ['REQUEST_LASTNAME']
    INDEX = os.environ['INDEX']
    PROJECTION_EXPRESSION = os.environ['PROJECTION_EXPRESSION']
    STATUS_FILTER = os.environ['STATUS_FILTER']

    quizID = event[EVENT_PATHPARAMETERS][REQUEST_QUIZID]
    age = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_AGE]
    gender = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_GENDER]
    firstName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_FIRSTNAME]
    lastName = event[EVENT_QUERYSTRINGPARAMETERS][REQUEST_LASTNAME]

    partitionKey = quizID + "#" + str(age).replace(" ", "") + "#" + gender.lower().replace(" ", "") + "#" + firstName.lower().replace(" ", "") + "#" + lastName.lower().replace(" ", "")

    results = tblQuizApplication.query(
        IndexName = INDEX,
        ProjectionExpression = PROJECTION_EXPRESSION,
        KeyConditionExpression = Key('QuizAgeGenderFirstNameLastName').eq(partitionKey),
        FilterExpression = Attr('Status').eq(STATUS_FILTER),
        ScanIndexForward = False
    )

    response = {
        RESPONSE_STATUSCODE: STATUSCODE_200,
        RESPONSE_BODY: json.dumps(results[DB_QUERY_RECORD], default=convertDecimalToInt),
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