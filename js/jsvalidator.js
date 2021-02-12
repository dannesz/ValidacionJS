class JSValidator {

    //Determina el estado actual de la validación
    status = true;

    errors = [];

    via = 'http';

    validators = {

        minLength: 3,
        maxLength: 255,

    }

    msgs = {

        required: `Este campo es requerido`,
        minLength: `Longitud no válida. Mínimo __minLength__ caracteres`,
        maxLength: `Longitud no válida. Máximo __maxLength__ caracteres`,
        email: `El campo de email no es valido`,
        integer: `Coloca un número entero`,
        alphanumeric: `Solo se permiten letras y numeros sin espacios `,
        url: `Escribe una URL valida (http:// o https//)`,
    }


    constructor(formId) { //El constructor recibe como parametro el ID del formulario

        //Definimos el formulario
        this.setForm(formId);

        //Definimos los campos del formulario que deben ser validados
        this.setInputs();

        this.parseInputs();

    }

    /* METODOS */

    setForm(formId) {

        this.form = document.getElementById(formId); //Llamamos al elemento que tiene este ID asignandolo a una variable de nombre "form"

    }

    setInputs() {

        this.inputs = document.querySelectorAll(`#${this.form.id} .jsValidator`);
    }

    setAjax() {

        this.via = 'ajax';

        return this;

    }

    parseInputs() {

        this.inputs.forEach(input => {

            this.appendErrorsTag(input);

        });

    }

    appendErrorsTag(input) {

        let parent = input.parentNode;

        let span = document.createElement('span');

        span.setAttribute("class", "error-msg");

        parent.appendChild(span);

    }

    validateForm() {

        this.form.addEventListener('submit', (e) => {

            // Reninicia los errores y cambia el estatus a 'true'
            this.resetValidation();

            // Recorre cada uno de los inputs
            this.inputs.forEach(input => {

                // Valida cada input
                this.validateInput(input);

            });

            if (!this.status) {

                // Prevenir el envio del formulario
                e.preventDefault();

            } else {

                if (this.via == 'ajax') {

                    e.preventDefault();

                    this.submitHandler();

                }

            }

        });

    }

    validateInputs() {

        this.inputs.forEach(input => {

            input.addEventListener('input', (e) => {

                this.resetValidation();

                this.validateInput(input);

            });

        });

    }

    validateInput(input) {

        let validators = input.dataset.validators; // 'validators' = 'required length'

        if (validators !== undefined) {

            validators = validators.split(' ');

            validators.forEach(validator => {

                this[`_${validator}`](input);

            });

        }

    }

    setError(input, msg) {

        // Cambiar el estado a false
        this.status = false;

        this.setStackError(input, msg);

        this.setErrorMessage(input, msg);

    }

    setStackError(input, msg) {

        this.errors.push({
            input: input,
            msg: msg
        })

    }


    setErrorMessage(input, msg) {

        // Recuperar el nodo de span de error
        let span = input.nextElementSibling;

        // añadir msg
        span.innerHTML += (msg + '<br />');

    }

    resetValidation() {

        // Se vacia el arreglo de errores
        this.resetStackError();

        // Elimina el texto de error-msg
        this.resetErrorMessage();

        // Se debe colocar this.status nuevamente en true
        this.status = true;

    }

    resetStackError() {

        // Reiniciar la pila de errores
        this.errors = [];

    }

    resetErrorMessage() {

        //Quitar los mensajes de eeror 
        let spans = document.querySelectorAll(`#${this.form.id} .error-msg`);

        spans.forEach(span => {

            span.innerHTML = ' ';

        });

    }

    submitHandler() {

        let data = new FormData(this.form);

        fetch(this.form.action, {

                method: this.form.method,
                body: data

            })
            .then(response => response.json())
            .then(data => {

                console.log(data);

            })
            .catch(error => {

                console.error(error)

            })

    }

    init() {

        this.validateForm();

        this.validateInputs();

        return this;

    }

}


/* PROTOTIPOS */

JSValidator.prototype._required = function (input) {

    let value = input.value;

    let msg = this.msgs.required;

    if (value.trim() == "" || value.length < 1) {

        this.setError(input, msg);

    }

};

JSValidator.prototype._length = function (input) {

    let value = input.value;

    let inputLength = value.length;

    let minLength = (input.dataset.validators_minLength !== undefined) ?
        Number(input.dataset.validators_minlength) : this.validators.minLength;

    let maxLength = (input.dataset.validators_maxLength !== undefined) ?
        Number(input.dataset.validators_maxlength) : this.validators.maxLength;

    let msg;

    if (inputLength < minLength) {

        msg = this.msgs.minLength.replace(`__minLength__`, minLength);

        this.setError(input, msg);

    }

    if (inputLength > maxLength) {

        msg = this.msgs.maxLength.replace(`__maxLength__`, maxLength);

        this.setError(input, msg);

    }

};

JSValidator.prototype._email = function (input) {

    // Recuperar el valor de input 
    let value = input.value;

    // Definir el mensaje de error
    let msg = this.msgs.email;

    //Expresion regular para validar el email
    let pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);

    // Si la validació falla mandar el error
    if (!pattern.test(value) && value.trim() != "") {

        this.setError(input, msg);

    }

};

JSValidator.prototype._integer = function (input) {

    let value = input.value;

    let msg = this.msgs.integer;

    let pattern = new RegExp(/^[0-9]+$/);

    if (!pattern.test(value) && value.trim() != "") {

        this.setError(input, msg);

    }

};

JSValidator.prototype._alphanumeric = function (input) {

    let value = input.value;

    let msg = this.msgs.alphanumeric;

    let pattern = new RegExp(/^[a-zA-Z0-9]+$/);

    if (!pattern.test(value) && value.trim() != "") {

        this.setError(input, msg);

    }

};


JSValidator.prototype._url = function (input) {

    // En primer lugar vamos a recuperar el valor del input
    let value = input.value;

    // Definir el mensaje de error
    let msg = this.msgs.url;

    // expresión regular para validar url
    var pattern = new RegExp(/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i);

    // En caso de que la validación falle mandar error.
    if (!pattern.test(value) && value.trim() != "") {

        this.setError(input, msg);

    }

}