""" Some doc """
import smtplib
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import re

def send_message(sender_name, sender_address, message):
    """
    Send a message to the webmaster
    """

    # connect to the server and send the email
    mail_server = smtplib.SMTP('www.bytecode.gr', 587)

    # prepare the message details
    sender = "%s <%s>" % (sender_name, sender_address)
    recipient = "Dimitris Balaouras <dbalaouras@bytecode.gr>"
    subject = "Message from bytecode.gr"
    message = MIMEText(message.encode('utf-8'), 'plain', 'utf-8')

    # create a multipart message (we're dispatching stricty in utf-8)
    msg = MIMEMultipart('alternative')
    msg["From"] = Header(sender, 'utf-8')
    msg["To"] = Header(recipient, 'utf-8')
    msg["Cc"] = Header(sender, 'utf-8')
    msg["Subject"] = Header(subject, 'utf-8')
    msg.attach(message)

    # send the mail
    mail_server.sendmail(sender_address, \
        "dbalaouras@bytecode.gr", msg.as_string())

    # close the connection
    mail_server.quit()


def valid_email(email_addr):
    """
    Email validation, checks for syntactically invalid email
    See http://aspn.activestate.com/ASPN/Cookbook/Python/Recipe/65215
    """
    
    emailregex = "^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3\
        })(\\]?)$"
    
    return True if len(email_addr) > 7\
        and re.match(emailregex, email_addr) != None\
        else False

if __name__ == "__main__":
    send_message("Dimitris Balaouras", "dbalaouras@gmail.com", "hello re")
