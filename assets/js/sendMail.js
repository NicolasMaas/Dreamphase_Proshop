let submit = document.querySelector('.js-submit'),
    form = document.querySelector('.js-form'),
    notification = document.querySelector('.js-notification'),
    notificationText = document.querySelector('.js-notification--text');

submit.addEventListener('click', async () => {
    let name = form.name.value,
        mail = form.mail.value,
        subject = form.subject.value,
        msg = form.msg.value,
        receiver = "nicolas@dreamphase.be",
        url = 'https://us-central1-nicolas-proshop.cloudfunctions.net/sendMail';

    console.log(name);
    console.log(mail);
    console.log(receiver);
    console.log(subject);
    console.log(msg);

    let data = {
        name: name,
        mail: mail,
        subject: subject,
        receiver: receiver,
        msg: msg
    }

    await fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(notification.classList.add("c-notification--success"))
        .catch(notification.classList.add("c-notification--error"));
});