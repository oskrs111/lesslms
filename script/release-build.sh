 #!/bin/bash
 cp --force "..\aws\formation\lesslms.template.json" "..\release\aws\formation\lesslms.template.json"
 cp --force "..\client\release\lesslms-frontend Setup 0.0.2.exe" "..\release\aws\client"
 7z a "..\release\aws\lambda\auth.zip" "..\aws\lambda\auth\*" 
 7z a "..\release\aws\lambda\lms.zip" "..\aws\lambda\lms\*" 
 7z a "..\release\aws\lambda\user.zip" "..\aws\lambda\user\*" 
 7z a "..\release\aws\lambda\xapi.zip" "..\aws\lambda\xapi\*" 
 7z a "..\release\aws.zip" "..\release\aws"
 
 
 
 
  