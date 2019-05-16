ECHO

curl -X POST \
  https://upload.box.com/api/2.0/files/content \
  -H 'Accept: */*' \
  -H 'Authorization: Bearer 6V9BA5AGtDH1RMnqkSjrjHapI4FWG8kh' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Host: upload.box.com' \
  -H 'Postman-Token: 7296d4cd-ba4a-4d2f-ac3b-7ca950c85786,fbeef0d2-dc3c-4cdf-8da9-d1a0b6eb9b3d' \
  -H 'User-Agent: PostmanRuntime/7.11.0' \
  -H 'accept-encoding: gzip, deflate' \
  -H 'cache-control: no-cache' \
  -H 'content-length: 632' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -F 'attributes={"name":"rfiddata003.xml", "parent": {"id": "76628355894"}}' \
  -F file=@/Users/jmahedy/Documents/Development/githr/jmahedy.github.io/NWR/RFID/rfiddata003.xml
