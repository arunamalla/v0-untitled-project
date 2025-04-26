// Add this to the register_meta calls in the create_client_post_type function
register_meta('post', 'stock_symbol', array(
    'object_subtype' => 'clients',
    'type' => 'string',
    'single' => true,
    'show_in_rest' => true,
));
