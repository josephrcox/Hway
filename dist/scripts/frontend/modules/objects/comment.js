export var commentObject = {
    body: "",
    display: function () {
        var p = document.createElement('div');
        p.innerText = this.body;
        document.body.appendChild(p);
    }
};
//# sourceMappingURL=comment.js.map