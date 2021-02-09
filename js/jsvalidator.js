class JSValidator {

    //Determina el estado actual de la validación
    status = true;

    errors = [];

    via = 'http';

    msgs = {

        required: `Este campo es requerido`,
        minLength: `Longitud no válida. Mínimo ${this.validators.minLength} caracteres`,
        maxLength: `Longitud no válida. Máximo ${this.validators.maxLength} caracteres`,
        email: `El campo de email no es válido`,
        integer: `El campo debe ser de tipo entero`,
        digit: `El valor debe ser un dígito`,
        url: `El campo debe ser una URL válida`

    }


    constructor(formId) { //El cosntrusctor recibe como parametro el ID del formulario

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

}

JSValidator.prototype._length = function (input) {


}