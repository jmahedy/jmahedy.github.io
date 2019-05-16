ECHO

curl -X POST \
  https://upload.box.com/api/2.0/files/content \
  -H 'Accept: */*' \
  -H 'Authorization: Bearer 6V9BA5AGtDH1RMnqkSjrjHapI4FWG8kh' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Host: upload.box.com' \
  -H 'Postman-Token: cb59d0f6-ce37-4018-afc4-d2ef6744c4cc,b299e61d-3c34-4338-983a-6aa2a2933b94' \
  -H 'User-Agent: PostmanRuntime/7.11.0' \
  -H 'accept-encoding: gzip, deflate' \
  -H 'cache-control: no-cache' \
  -H 'content-length: 613' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -F 'attributes={"name":"rfiddata002.xml", "parent": {"id": "76628355894"}}' \
  -F file=@/Users/jmahedy/Documents/Development/githr/jmahedy.github.io/NWR/RFID/rfiddata002.xml
