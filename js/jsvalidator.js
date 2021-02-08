class JSValidator {

    //Determina el estado actual de la validación
    status = true;

    constructor(formId) { //El cosntrusctor recibe como parametro el ID del formulario

        //Definimos el formulario
        this.setForm(formId);

        //Definimos los campos del formulario que deben ser validados
        this.setInputs();

        this.parseInputs();

    }

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

            this.inputs.forEach(input => {

                this.validateInput(input);

            });

            if(!this.status) {

                // Prevenir el envio del formulario
                e.preventDefault();

                console.log('Ha ocurrido un error de validación');

            } else {

                console.log('El formulario se envio correctamente');

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

    init() {

        this.validateForm();

        return this;

    }

}


//PROTOTIPOS

JSValidator.prototype._required = function (input) {

    let errors = true;

    if(errors) {

        this.status = false;

    }

}

JSValidator.prototype._length = function (input) {


}