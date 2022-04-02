var pathname = window.location.pathname;
export function getPageType() {
    if (pathname.includes('/all/')) {
        // user is on all or default page
        return ['all'];
    }
    else if (pathname.includes('/h/')) {
        // user is on a topic page
        return ['topic', pathname.split('/h/')[1].split('/')[0]];
    }
    else if (pathname.includes('/p/')) {
        // user is on a topic page
        return ['post', pathname.split('/p/')[1]];
    }
    else if (pathname.includes('/user/')) {
        // user is on a user profile page
    }
    else if (pathname.includes('/login/')) {
        // user is on login page
    }
    else if (pathname.includes('/register/')) {
        // user is on registration page
    }
    else if (pathname.includes('/notifications/')) {
        // user is on notifications
    }
    else if (pathname.includes('/subscriptions')) {
        // user is on subscriptions page
    }
    else if (pathname.includes('/post/')) {
        // user is creating a new post
        return ['createnewpost'];
    }
}
export function getPageTopic() {
    return pathname.split('/h/')[1].split('/')[0];
}
//# sourceMappingURL=pageAnalyzer.js.map