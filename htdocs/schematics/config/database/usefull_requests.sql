-- request all articles wich are not in a categories but are set is_used.

SELECT * 
FROM article
WHERE article.is_used = TRUE AND article.ref NOT IN 
    (SELECT DISTINCT article_ref FROM category_article);