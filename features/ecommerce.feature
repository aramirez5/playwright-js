Feature: Ecommerce validations

    @Regression
    Scenario: Placing the order
        Given a login to ecommerce application with "pmdzjbrgbhwnkescia@tpwlb.com" and "Iamking@000"
        When add "ZARA COAT 3" to cart
        Then verify "ZARA COAT 3" is displayed in the cart
        When enter valid details and place the order
        Then verify order in present in the order history