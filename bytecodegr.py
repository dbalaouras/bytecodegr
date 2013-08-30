"""  This module implements a Flask website """

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
import services
import configuration

# create the application object
APP = Flask(__name__)

# load configuration
APP.config.from_object(configuration)

@APP.route('/', methods=['GET', 'POST'])
def home():
    """
    Respond to message requests
    """

    return render_template('main.html',
        background=services.get_random_background())


@APP.route('/ajax/send_msg', methods=['GET', 'POST'])
def send_message_ajax():
    """
    Handle contact requests sent via Ajax
    """

    # create some initial message
    response = {"status": 1, "message": "message could not be sent"}

    # retrieve the sender and message from the request
    sender_name = request.form.get("name", None)
    sender_address = request.form.get("email", None)
    message = request.form.get("message", None)

    # send the message
    if sender_name and sender_address and message:

        try:
            if services.valid_email(sender_address):
                services.send_message(sender_name, sender_address, message)
                response = {"status": 0, "message": \
                    "Your message has been sent. Thank you!"}
            else:
                response = {"status": 1, "message":\
                    "Please submit a valid email address."}

        # this is a bit too broad, but I don't want my APP broken in any way
        except Exception as e:
            print e
            response = {"status": 2, "message": \
                    "That didn't reach my inbox!\
                    Did you have breakfast this morning?"}
    else:
        response = {"status": 1, "message": "Please fill in all the details."}
    
    return jsonify(response)


@APP.route('/send_msg', methods=['POST'])
def send_message():
    """
    Handle contact requests sent via form POST
    """

    # retrieve the sender and message from the request
    sender_name = request.form.get("name", None)
    sender_address = request.form.get("email", None)
    message = request.form.get("message", None)

    # send the message
    if sender_name and sender_address and message:
        services.send_message(sender_name, sender_address, message)
    
    return render_template('main.html')

if __name__ == '__main__':
    APP.run(debug=True)
