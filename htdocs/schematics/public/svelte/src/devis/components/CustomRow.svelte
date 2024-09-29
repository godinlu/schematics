<div class="custom-row">
    <slot></slot>
</div>

<style>
    .custom-row{
        display: grid; /* Utilisation de CSS Grid */
        grid-template-columns: 15% 50% 10% 15% 5% 5%; /* Définit les largeurs de colonnes */
        border-top: 1px solid #ddd;
    }
    .custom-row:nth-child(even){
	    background-color: #f2f2f2;
    }
    .custom-row:last-child{
        border-bottom: 1px solid #ddd;
    }
</style>