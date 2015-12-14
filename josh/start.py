import webbrowser
import os
import subprocess



chrome_path = 'open -a /Applications/Google\ Chrome.app %s --args --allow-file-access-from-files'


pwd = subprocess.check_output("pwd", shell=True)




html = '/app.html'



pwd = pwd.strip()

url = pwd + html

url = url.strip()




os.system("killall -9 'Google Chrome'")

webbrowser.get(chrome_path).open(url)
