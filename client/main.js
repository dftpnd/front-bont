import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import './main.html';

var text = new ReactiveVar('Быть или не быть, вот в чем вопрос');
var yodaSay = new ReactiveVar('');

function posPromis(word) {
    const key = 'dict.1.1.20160820T120709Z.c6fded8828855c62.13e5fe77f32e17beb3b6d3b5bd02b15119242ef6';

    const url = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup';

    const options = '?key=' + key + '&lang=ru-ru' + '&text=' + word;

    const path = url + options;

    return fetch(path)
    .then((response)=> response.json())
    .then((data)=> ()=> data.def[0])
}

function wordSplit(text) {
    const wordList = [];

    text
    .split(' ')
    .forEach((text)=> {
        if (text)
            wordList.push(text.replace(',', '').replace('.', ''));
    });

    return wordList;
}
function translateYoda(words, posWords) {
    // https://otvet.mail.ru/question/78071199
    /**
     *  глагол
     *  союз
     *  частица
     *  предлог
     *  существительное
     *  местоимение
     */

    var sortWords =  posWords.map((item)=> {

        /**
         * todo  написать нейронную сеть xD
         */
    });
    var res = words.map((word)=> {
        if (word) return word.toLowerCase() + ' ';
    });

    return res.reverse();
}

function submitForm(event) {

    const words = wordSplit(text.get());

    const posPromise = words.map((word)=> posPromis(word));

    Promise.all(posPromise)
    .then(results => {
        const posWords = results.map((promise)=> promise());
        const yodaWords = translateYoda(words, posWords);

        yodaSay.set(yodaWords.join('') + '..');
    })
}

Template.form.events({
    'input .js-text': (e)=> {
        text.set(e.target.value);
    },
    'click button': submitForm
});

Template.form.helpers({
    text: text.get()
});

Template.yoda.helpers({
    yodaSay: () => yodaSay.get()
});


