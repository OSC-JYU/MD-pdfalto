# MD-pdfalto
MessyDesk wrapper for [pdfalto](https://github.com/kermitt2/pdfalto)

# example API call

In the "MD-pdfalto" directory type:

	curl -X POST -H "Content-Type: multipart/form-data" \
	  -F "request=@test/pdf2alto.json;type=application/json" \
	  -F "content=@test/sample.pdf" \
	  http://localhost:8300/process

This will return JSON with "store" URL, where one can download the result.

	{
	  "response": {
	    "type": "stored",
	    "uri": "files/319f28f7-9723-428b-989e-3206630624e9/alto.xml"
	  }
	}
