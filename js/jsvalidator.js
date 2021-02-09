class JSValidator {

    //Determina el estado actual de la validación
    status = true;

    errors = [];


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

                console.log('ERROR. Ha ocurrido un error de validación');

            } else {

                // Para fines de prueba
                e.preventDefault();

                console.log('ÉXITO. El formulario se envio correctamente');

            }

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

    init() {

        this.validateForm();

        return this;

    }

}


/* PROTOTIPOS */

JSValidator.prototype._required = function (input) {

    let value = input.value;

    let msg = 'Este campo es requerido';

    if (value.trim() == "" || value.length < 1) {

        this.setError(input, msg);

    }

}

JSValidator.prototype._length = function (input) {


}