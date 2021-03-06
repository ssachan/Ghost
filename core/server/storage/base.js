var moment  = require('moment'),
    path    = require('path'),
    Promise = require('bluebird'),
    baseStore;

// TODO: would probably be better to put these on the prototype and have proper constructors etc
baseStore = {
    'getTargetDir': function (baseDir) {
        var m = moment(new Date().getTime()),
            month = m.format('MMM'),
            year =  m.format('YYYY');

        if (baseDir) {
            return path.join(baseDir, year, month);
        }

        return path.join(year, month);
    },
    'generateUnique': function (store, dir, name, ext, i, done) {
        var self = this,
            filename,
            append = '';

        if (i) {
            append = '-' + i;
        }

        filename = path.join(dir, name + append + ext);

        store.exists(filename).then(function (exists) {
            if (exists) {
                setImmediate(function () {
                    i = i + 1;
                    self.generateUnique(store, dir, name, ext, i, done);
                });
            } else {
                done(filename);
            }
        });
    },
    'getUniqueFileName': function (store, image, targetDir) {
        var ext = path.extname(image.name),
            name = path.basename(image.name, ext).replace(/[\W]/gi, '-'),
            self = this;

        return new Promise(function (resolve) {
            self.generateUnique(store, targetDir, name, ext, 0, resolve);
        });
    }
};

module.exports = baseStore;
