<script>
    import IconButton from "../components/IconButton.svelte";
    

    export let article;

</script>
<tr>
    <td>{article.ref}</td>
    <td>{article.label}</td>
    <td><input type="number" value="1" min="1" max="99"></td>
    <td>{article.prix}</td>
    <td>
        <button><i class="fa-solid fa-pen"></i></button>
    </td>
    <td>
        <button><i class="fa-solid fa-trash"></i></button>
    </td>
</tr>

<style>
</style>