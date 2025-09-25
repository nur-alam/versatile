### WHy get method returns like every value as an instance of model
every value is like instance of a model that why i have to build $temp_logins by looping through it 

what the reason benifit use case of returning every result as a model instance 

Kiro
Great question! Returning model instances instead of raw arrays/objects provides several key benefits in an ORM pattern. Let me break down why this approach is valuable:

Key Benefits of Model Instances
1. Data Encapsulation & Type Safety

Each model instance ensures data integrity and consistent structure
Properties are properly typed and validated
Prevents direct manipulation of raw database data
2. Business Logic Integration

Models can contain methods for business operations
Example: $tempLogin->isExpired(), $tempLogin->generateNewToken(), $tempLogin->deactivate()
Keeps related functionality grouped with the data
3. Attribute Casting & Formatting

Automatic conversion of database values to proper PHP types
Date formatting, boolean conversion, JSON parsing
Your current manual casting (intval(), (bool)) would be handled automatically
4. Relationships & Lazy Loading

Easy access to related models: $tempLogin->user(), $tempLogin->logs()
Efficient loading of related data when needed
5. Consistent API

Same interface whether you're working with a single model or collection
Predictable method availability across your application