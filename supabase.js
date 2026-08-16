/* Supabase Client Minimal Stub Wrapper */
(function(global) {
    var SupabaseClient = function(url, key) {
        this.url = url;
        this.key = key;
    };
    SupabaseClient.prototype.from = function(tableName) {
        var self = this;
        var headers = {
            'apikey': self.key,
            'Authorization': 'Bearer ' + self.key,
            'Content-Type': 'application/json'
        };
        return {
            select: function() {
                return {
                    order: function() {
                        return {
                            limit: function() {
                                return fetch(self.url + '/rest/v1/' + tableName + '?select=*', {
                                    method: 'GET',
                                    headers: headers
                                }).then(function(r) { return r.json().then(function(d) { return { data: d, error: !r.ok ? d : null }; }); });
                            }
                        };
                    }
                };
            },
            insert: function(payloadArray) {
                return fetch(self.url + '/rest/v1/' + tableName, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payloadArray)
                }).then(function(r) { 
                    if (r.status === 201 || r.ok) {
                        return { data: payloadArray, error: null };
                    }
                    return r.json().then(function(d) { return { data: null, error: d }; });
                });
            }
        };
    };
    global.supabaseJs = {
        createClient: function(url, key) {
            return new SupabaseClient(url, key);
        }
    };
    global.supabase = global.supabaseJs;
})(window);
