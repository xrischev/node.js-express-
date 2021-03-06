const mongoose = require('mongoose');

let articleSchmea = mongoose.Schema({
    title: { type: String, require: true },
    content: { type: String, require: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    comment:[{type: mongoose.Schema.Types.ObjectId, required: true, ref: 'CommentArticle'}],
    category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
    likes: [{ type: mongoose.Schema.Types.ObjectId,  ref: 'ArticleLikes' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref:'Tag' }],
    date: { type: Date, default: Date.now() }
});

articleSchmea.method({
   prepareInsert: function () {
       let User = mongoose.model('User');
       User.findById(this.author).then(user => {
           user.articles.push(this.id);
           user.save();
       });

       let Category = mongoose.model('Category');
       Category.findById(this.category).then(category => {
          if (category) {
              category.articles.push(this.id);
              category.save();
          }
       });

       let Tag = mongoose.model('Tag');
       for (let tagId of this.tags) {
           Tag.findById(tagId).then(tag => {
               if (tag) {
                   tag.articles.push(this.id);
                   tag.save();
               }
           });
       }
   }, 
    prepareDelete: function () {
        let User = mongoose.model('User');
        User.findById(this.author).then(user => {
            if (user) {
                user.articles.remove(this.id);
                user.save();
            }
        });



        let Category = mongoose.model('Category');
        Category.findById(this.category).then(category => {
            if (category) {
                category.articles.remove(this.id);
                category.save();
            }
        });

        let Tag = mongoose.model('Tag');
        for (let tagId of this.tags) {
            Tag.findById(tagId).then(tag => {
                if (tag) {
                    tag.articles.remove(this.id);
                    tag.save();
                }
            });
        }
    },
    deleteTag: function (tagId) {
        this.tags.remove(tagId);
        this.save();
    }
});

const Article = mongoose.model('Article', articleSchmea);

module.exports = Article;