<div class="custom-col">
    <slot></slot>
</div>
<style>
    .custom-col{
        border-left: 1px solid #ddd;
        padding: 8px;
    }
    .custom-col:last-child{
        border-right: 1px solid #ddd;
    }
    
</style>