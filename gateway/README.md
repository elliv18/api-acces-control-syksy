# API Gateway using tyk.io

Initial sample with mock backend


## Running Tyk locally in Docker container for testing

Hot reload tyk APIs after changes

    curl http://localhost:8080/tyk/reload -H 'x-tyk-authorization:  352d20ee67be67f6340b4c0605b044b7'


## Generating API key

    curl -X POST \
      http://localhost:8080/tyk/keys/create \
      -H 'Content-Type: application/json' \
      -H 'x-tyk-authorization: 352d20ee67be67f6340b4c0605b044b7' \
      -d '{
        "allowance": 1000,
        "rate": 1000,
        "per": 1,
        "expires": -1,
        "quota_max": -1,
        "org_id": "1",
        "quota_renews": 1449051461,
        "quota_remaining": -1,
        "quota_renewal_rate": 60,
        "access_rights": {
          "1": {
            "api_id": "1",
            "api_name": "Tyk Test API",
            "versions": ["Default"]
          }
        },
        "jwt_data": {
    	 "secret": "Secret"
    	},
        "meta_data": {}
    }'

Response ex.

    {
      "key":"3f0debb70c01f462aadd09c7ca7b43240",
      "status":"ok",
      "action":"added",
      "key_hash":"9270040d"
      }

## Call api with API key

    curl -X GET \
    http://localhost:8080/tyk-api-test/ \
    -H 'Authorization: 3f0debb70c01f462aadd09c7ca7b43240' 