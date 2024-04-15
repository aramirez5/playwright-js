Feature: Ecommerce error validations
  
  @Validation
  Scenario: Login in ecommerce
    Given a login to new ecommerce application with "<username>" and "<password>"
    Then verify error message is displayed

    Examples:
        | username           | password     |
        | anshika@gmail.com  | Iamking@000  |
        | hello@123.com      | Iamhello@12  |