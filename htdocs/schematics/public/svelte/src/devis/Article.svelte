<script>
    export let article;
</script>
<tr>
    <td>{article.ref}</td>
    <td>{article.label}</td>
    <td><input type="number" value="1" min="1" max="99"></td>
    <td>{article.prix}</td>
    <td>
        <button>up</button>
        <button>down</button>
        <button>edit</button>
        <button>remove</button>
    </td>
</tr>