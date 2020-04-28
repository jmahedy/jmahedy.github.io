ECHO
curl -X POST \
  https://upload.box.com/api/2.0/files/content \
  -H 'Accept: */*' \
  -H 'Authorization: Bearer 6V9BA5AGtDH1RMnqkSjrjHapI4FWG8kh' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Host: upload.box.com' \
  -H 'Postman-Token: 29387522-6023-4e61-a100-1603903a6ef2,199ec5ba-c62b-4d91-a0b7-38d4ab1e8110' \
  -H 'User-Agent: PostmanRuntime/7.11.0' \
  -H 'accept-encoding: gzip, deflate' \
  -H 'cache-control: no-cache' \
  -H 'content-length: 632' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -F 'attributes={"name":"rfiddata001.xml", "parent": {"id": "76628355894"}}' \
  -F file=@/Users/jmahedy/Documents/Development/githr/jmahedy.github.io/NWR/RFID/rfiddata001.xml
