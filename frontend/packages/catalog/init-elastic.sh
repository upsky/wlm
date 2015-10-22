#!/bin/bash
curl=`which curl 2> /dev/null`

if [ -z "$curl" ]; then
  echo "curl not found"
  exit 1
fi

if [ -z "$es" ]; then
  es="http://localhost:9200"
fi

"$curl" -s -XDELETE "$es/catalog" > /dev/null 2>&1
"$curl" -s -XPUT "$es/catalog" && echo
"$curl" -s -XPUT "$es/catalog/goods/_mapping" -d '{
  "goods": {
    "_all": { "analyzer": "russian_morphology" },
    "properties": {
      "title": { "type": "string", "analyzer": "russian_morphology" },
      "description": { "type": "string", "analyzer": "russian_morphology" }
    }
  }
}' && echo
