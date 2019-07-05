echo
curl -X PUT \
  https://api.box.com/2.0/files/485447408388/metadata/enterprise_210445550/policy \
  -H 'Accept: */*' \
  -H 'Authorization: Bearer nnmMtAOuXsffRbtnNLFLBVnfkTy5Kb5z' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json-patch+json' \
  -H 'Host: api.box.com' \
  -H 'Postman-Token: 38478125-6526-4a30-8a70-8df985cd99c7,99311d2a-fc32-42b7-97c8-a40e15036374' \
  -H 'User-Agent: PostmanRuntime/7.13.0' \
  -H 'accept-encoding: gzip, deflate' \
  -H 'cache-control: no-cache' \
  -H 'content-length: 62' \
  -d '[{"op": "add", "path": "/systemReference", "value": 10010101}]'
