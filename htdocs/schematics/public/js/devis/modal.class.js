class Modal{
    constructor(){
        let body = document.querySelector("body");
        this.modal_div = document.createElement("div");
        this.modal_div.classList.add("modal");

        this.content_div = document.createElement("div");
        this.content_div.classList.add("modal-content");

        this.modal_div.appendChild(this.content_div);

        body.appendChild(this.modal_div);

        this.modal_div.onclick = (e) => {
            if (e.target === this.modal_div) this.modal_div.style.display = 'none';
        };
    }


    show(){
        this.modal_div.style.display = "flex";
    }

    hide(){
        this.modal_div.style.display = "none";
    }
}