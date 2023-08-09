# Leos Repository

LEOS Repository can be configured with different datasources:

- H2, in-memory DB for test purpose
- Oracle

The profile can be changed in config/src/etc/resources/application.properties, setting spring.profiles.active to oracle or h2.


## H2 Configuration


###  Config DataSource in server.xml

    <GlobalNamingResources>
        ....			  
        <Resource name="jdbc/leosRepository" 
                  global="jdbc/leosRepository" 
                  auth="Container" 
                  type="javax.sql.DataSource" 
                  driverClassName="oracle.jdbc.OracleDriver" 
                  url="jdbc:oracle:thin:@10.178.50.152:1521:oracle" 
                  username="leos_repository" 
                  password="leos_repository" 
                  maxTotal="100" 
                  maxIdle="20" 
                  minIdle="5" 
                  maxWaitMillis="10000"/>
              
    </GlobalNamingResources>
    
     
### Add context.xml
    <Context>
        ...
    
    	<ResourceLink name="jdbc/leosRepository"
                        global="jdbc/leosRepository"
                        auth="Container"
                        type="javax.sql.DataSource" />
    <Context>
    
    
    
### Oracle

ojdbc8 is not released as part of this application. 
Add the jar in your application server classpath before running Repository.