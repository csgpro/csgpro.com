interface Function {
    /**
     * sitemap {Boolean} or {Object}
     * If True, Title is set to Controller/Action
     * If Object, Title is set to value of 'title' property
     */
    sitemap?: boolean | { title: string };
    /**
     * route {String}
     * Sets a custom route for the action
     */
    route?: string;
}