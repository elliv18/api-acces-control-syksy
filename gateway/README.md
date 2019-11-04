# API Gateway using tyk.io

Initial sample two free REST APIs as backends.

## Running Tyk locally in Docker container for testing

Variable TYK_GW_SECRET must be set in .env file. this secret is used to authenticate to management API.
Management API is used to create and delete keys, enabling and disabling APIs etc.
**Change default secret in production!**

TYK_GW_SECRET=352d20ee67be67f6340b4c0605b044b7

To Start only the gateway for testing, also starts redis for persistence.

docker-compose up gateway

## Reloading API gateway

Hot reload tyk APIs after making changes to changes

    curl http://localhost:8080/tyk/reload -H 'x-tyk-authorization: 352d20ee67be67f6340b4c0605b044b7'

## Generating API key

This example key grants full access to API 2 and restricted access API 1. Only specified paths and methods are allowed in API 1. Also specifies things like rate limiting, usage quota and expiry (-1 means is valid forever)

This key will have use quota of 10 API calls, that renews every 60 seconds.

See https://tyk.io/docs/security/security-policies/secure-apis-method-path/ for info about restricting based on url.

```
curl -X POST \
      http://localhost:8080/tyk/keys/create \
      -H 'Content-Type: application/json' \
      -H 'x-tyk-authorization: 352d20ee67be67f6340b4c0605b044b7' \
      -d '{
    "allowance": 1000,
    "rate": 1000,
    "per": 1,
    "expires": -1,
    "quota_max": 10,
    "org_id": "3",
    "quota_renews": 1449051461,
    "quota_remaining": 10,
    "quota_renewal_rate": 60,
    "access_rights": {
      "1": {
        "api_id": "1",
        "api_name": "First API",
        "versions": ["Default"],
        "allowed_urls": [
        	{
        		"url": "/todos(/.*)?",
        		"methods": ["GET"]
        	},
        	{
        		"url": "/users(/.*)?",
        		"methods": ["GET", "POST", "PUT", "DELETE"]
        	}
        	]
      },
       "2": {
        "api_id": "2",
        "api_name": "Second API",
        "versions": ["Default"]
      }
    },
    "meta_data": {}
}'
```

Response ex.

```
{
  "key":"3f0debb70c01f462aadd09c7ca7b43240",
  "status":"ok",
  "action":"added",
  "key_hash":"9270040d"
}
```

## Getting list of APIs from gateway

```

curl -X GET \
http://localhost:8080/tyk/apis \
-H 'x-tyk-authorization: 352d20ee67be67f6340b4c0605b044b7'

```

## Getting list of existing API keys

```

curl -X GET \
http://localhost:8080/tyk/keys \
-H 'x-tyk-authorization: 352d20ee67be67f6340b4c0605b044b7'

```

## Deleting API key

```
curl -X DELETE \
  'http://192.168.44.129:8080/tyk/keys/4f6d2815?hashed=true' \
  -H 'Content-Type: application/json' \
  -H 'x-tyk-authorization: 352d20ee67be67f6340b4c0605b044b7'
```

response: 200 OK

```
{
    "key": "4f6d2815",
    "status": "ok",
    "action": "deleted"
}
```

## Call api with API key

The API key generated is used for authorization for APIs.

```
curl -X GET \
http://localhost:8080/first-api/todos/1 \
-H 'Authorization: 3f0debb70c01f462aadd09c7ca7b43240'

curl -X GET \
http://localhost:8080/second-api/breweries/1 \
-H 'Authorization: 3f0debb70c01f462aadd09c7ca7b43240'
```

## Create an API

To create the API, lets send a definition to the admin endpoint. Change the x-tyk-authorization value and curl domain name and port to be the correct values for your environment.

```
curl -v -H "x-tyk-authorization: 352d20ee67be67f6340b4c0605b044b7" \
  -s \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{
    "name": "Test API",
    "slug": "test-api",
    "api_id": "1",
    "org_id": "1",
    "auth": {
      "auth_header_name": "Authorization"
  	},
    "definition": {
      "location": "header",
      "key": "x-api-version"
  	},
    "version_data": {
      "not_versioned": true,
      "versions": {
        "Default": {
          "name": "Default",
          "use_extended_paths": true
        }
    	}
    },
    "proxy": {
      "listen_path": "/test-api/",
      "target_url": "http://httpbin.org/",
      "strip_listen_path": true
    },
    "active": true
}' http://localhost:8080/tyk/apis/ | python -mjson.tool
```

If the command succeeds, you will see:

```
{
  "action": "added",
  "key": "1",
  "status": "ok"
}
```

https://tyk.io/docs/with-tyk-community-edition/tutorials/create-api/
