 #!/bin/bash
 cp --force "..\aws\formation\lesslms.template.json" "..\release\aws\formation\lesslms.template.json"
 7z a "..\release\aws\lambda\auth.zip" "..\aws\lambda\auth\*" 
 7z a "..\release\aws\lambda\lms.zip" "..\aws\lambda\lms\*" 
 7z a "..\release\aws\lambda\user.zip" "..\aws\lambda\user\*" 
 7z a "..\release\aws\lambda\xapi.zip" "..\aws\lambda\xapi\*" 
 7z a "..\release\aws.zip" "..\release\aws" 
 
 
 
  