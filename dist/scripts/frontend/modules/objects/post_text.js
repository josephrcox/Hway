export var post_textObject = {
    title: "",
    poster_name: "",
    createdAt: "",
    display: function () {
        var container = document.createElement('div');
        container.classList.add('post-container');
        var title = document.createElement('span');
        title.innerText = this.title;
        var subtitle = document.createElement('span');
        subtitle.innerText = this.poster_name + " - " + this.createdAt;
        container.append(title, subtitle);
        document.body.appendChild(container);
    }
};
//# sourceMappingURL=post_text.js.map