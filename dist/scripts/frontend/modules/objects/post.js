export var postObject = {
    title: "",
    display: function () {
        var container = document.createElement('div');
        container.classList.add('post-container');
        var title = document.createElement('span');
        title.innerText = this.title;
        var subtitle = document.createElement('span');
        subtitle.innerText = this.poster_name + " - " + this.
            container.appendChild(title);
        document.body.appendChild(container);
    }
};
//# sourceMappingURL=post.js.map