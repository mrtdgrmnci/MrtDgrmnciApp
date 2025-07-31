require('dotenv').config();
const bcrypt = require('bcryptjs');
const { run } = require('../config/database');

const seedData = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await run(
      'INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)',
      ['admin@example.com', hashedPassword, 'admin']
    );

    // Sample projects data
    const projects = [
      {
        title: 'AI-Powered Test Automation Framework',
        description: 'Advanced test automation framework integrating AI capabilities for intelligent test case generation, self-healing tests, and predictive analytics. Built with Selenium, Java, and machine learning components.',
        technologies: JSON.stringify(['Selenium', 'Java', 'AI/ML', 'TestNG', 'Maven', 'Jenkins', 'Allure']),
        image_url: 'https://via.placeholder.com/600x400/2563eb/ffffff?text=AI+Testing+Framework',
        github_url: 'https://github.com/mrtdgrmnci/ai-testing-framework',
        live_url: null,
        featured: true,
        order_index: 1
      },
      {
        title: 'Playwright E2E Testing Suite',
        description: 'Modern end-to-end testing framework using Playwright with TypeScript. Includes API testing, visual regression testing, and comprehensive test coverage for web applications.',
        technologies: JSON.stringify(['Playwright', 'TypeScript', 'API Testing', 'Visual Testing', 'GitHub Actions']),
        image_url: 'https://via.placeholder.com/600x400/059669/ffffff?text=Playwright+Testing',
        github_url: 'https://github.com/mrtdgrmnci/playwright-suite',
        live_url: null,
        featured: true,
        order_index: 2
      },
      {
        title: 'Rest Assured API Testing Framework',
        description: 'Robust API testing framework built with Rest Assured and Karate. Features contract testing, data-driven testing, and integration with CI/CD pipelines.',
        technologies: JSON.stringify(['Rest Assured', 'Karate', 'Java', 'API Testing', 'Contract Testing', 'Jenkins']),
        image_url: 'https://via.placeholder.com/600x400/7c3aed/ffffff?text=API+Testing',
        github_url: 'https://github.com/mrtdgrmnci/api-testing-framework',
        live_url: null,
        featured: true,
        order_index: 3
      },
      {
        title: 'JMeter Performance Testing Suite',
        description: 'Load testing and performance monitoring framework using Apache JMeter. Includes distributed testing, real-time monitoring, and comprehensive performance reports.',
        technologies: JSON.stringify(['JMeter', 'Java', 'Performance Testing', 'Load Testing', 'Grafana']),
        image_url: 'https://via.placeholder.com/600x400/dc2626/ffffff?text=Performance+Testing',
        github_url: 'https://github.com/mrtdgrmnci/performance-testing',
        live_url: null,
        featured: false,
        order_index: 4
      },
      {
        title: 'Cybersecurity Testing Framework',
        description: 'Comprehensive security testing framework for government applications. Includes penetration testing automation, vulnerability assessment, and compliance testing for public and secret clearance requirements.',
        technologies: JSON.stringify(['Security Testing', 'Penetration Testing', 'Java', 'Python', 'OWASP', 'NIST']),
        image_url: 'https://via.placeholder.com/600x400/ef4444/ffffff?text=Security+Testing',
        github_url: 'https://github.com/mrtdgrmnci/security-testing-framework',
        live_url: null,
        featured: true,
        order_index: 5
      }
    ];

    // Insert projects
    for (const project of projects) {
      await run(
        'INSERT OR IGNORE INTO projects (title, description, technologies, image_url, github_url, live_url, featured, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [project.title, project.description, project.technologies, project.image_url, project.github_url, project.live_url, project.featured, project.order_index]
      );
    }

    // Sample skills data
    const skills = [
      { name: 'Selenium WebDriver', proficiency: 95, category: 'automation', icon: 'fas fa-robot', order_index: 1 },
      { name: 'Playwright', proficiency: 92, category: 'automation', icon: 'fas fa-play', order_index: 2 },
      { name: 'Rest Assured', proficiency: 92, category: 'api-testing', icon: 'fas fa-api', order_index: 3 },
      { name: 'Java', proficiency: 90, category: 'programming', icon: 'fab fa-java', order_index: 4 },
      { name: 'Python', proficiency: 88, category: 'programming', icon: 'fab fa-python', order_index: 5 },
      { name: 'Postman', proficiency: 90, category: 'api-testing', icon: 'fas fa-envelope', order_index: 6 },
      { name: 'Karate Framework', proficiency: 87, category: 'api-testing', icon: 'fas fa-fist-raised', order_index: 7 },
      { name: 'AI Testing', proficiency: 85, category: 'emerging-tech', icon: 'fas fa-brain', order_index: 8 },
      { name: 'Test Management', proficiency: 90, category: 'management', icon: 'fas fa-tasks', order_index: 9 },
      { name: 'JMeter', proficiency: 88, category: 'performance', icon: 'fas fa-tachometer-alt', order_index: 10 },
      { name: 'Jenkins', proficiency: 85, category: 'ci-cd', icon: 'fab fa-jenkins', order_index: 11 },
      { name: 'TestNG', proficiency: 88, category: 'automation', icon: 'fas fa-vial', order_index: 12 },
      { name: 'Git', proficiency: 90, category: 'version-control', icon: 'fab fa-git-alt', order_index: 13 },
      { name: 'Docker', proficiency: 80, category: 'devops', icon: 'fab fa-docker', order_index: 14 },
      { name: 'Cybersecurity Testing', proficiency: 80, category: 'security', icon: 'fas fa-shield-alt', order_index: 15 }
    ];

    // Insert skills
    for (const skill of skills) {
      await run(
        'INSERT OR IGNORE INTO skills (name, proficiency, category, icon, order_index) VALUES (?, ?, ?, ?, ?)',
        [skill.name, skill.proficiency, skill.category, skill.icon, skill.order_index]
      );
    }

    // Sample experience data
    const experience = [
      {
        title: 'QA Automation Advisor',
        company: 'General Dynamics',
        location: 'Washington, DC',
        start_date: '2022-01',
        end_date: null,
        current: true,
        description: 'Lead test management and QA advisory initiatives with focus on AI testing integration. Implement comprehensive test automation frameworks using Selenium, Playwright, and Rest Assured. Mentor QA teams and establish best practices for AI-powered testing solutions.',
        technologies: JSON.stringify(['Selenium', 'Playwright', 'Rest Assured', 'Java', 'JMeter', 'Postman', 'Karate', 'AI Testing', 'Test Management']),
        order_index: 1
      },
      {
        title: 'Senior QA Automation Engineer',
        company: 'Capital One',
        location: 'McLean, VA',
        start_date: '2019-03',
        end_date: '2021-12',
        current: false,
        description: 'Developed and maintained automated test suites for financial applications. Implemented API testing frameworks using Rest Assured and Postman. Collaborated with development teams to ensure high-quality software delivery.',
        technologies: JSON.stringify(['Selenium', 'Rest Assured', 'TestNG', 'Java', 'Jenkins', 'Postman']),
        order_index: 2
      },
      {
        title: 'QA Engineer',
        company: 'UnitedHealth Group',
        location: 'Minneapolis, MN',
        start_date: '2017-06',
        end_date: '2019-02',
        current: false,
        description: 'Performed manual and automated testing for healthcare applications. Built initial automation frameworks using Selenium WebDriver and Java. Established testing processes and procedures.',
        technologies: JSON.stringify(['Selenium', 'Java', 'JUnit', 'Manual Testing', 'Test Planning']),
        order_index: 3
      }
    ];

    // Insert experience
    for (const exp of experience) {
      await run(
        'INSERT OR IGNORE INTO experience (title, company, location, start_date, end_date, current, description, technologies, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [exp.title, exp.company, exp.location, exp.start_date, exp.end_date, exp.current, exp.description, exp.technologies, exp.order_index]
      );
    }

    // Sample education data
    const education = [
      {
        degree: 'Master of Science in Software Engineering',
        institution: 'University of Minnesota',
        location: 'Minneapolis, MN',
        start_date: '2015-09',
        end_date: '2017-05',
        current: false,
        description: 'Specialized in software testing methodologies, quality assurance, and test automation frameworks. Completed thesis on "Automated Testing Strategies for Enterprise Applications."',
        gpa: '3.8/4.0',
        order_index: 1
      },
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Istanbul Technical University',
        location: 'Istanbul, Turkey',
        start_date: '2011-09',
        end_date: '2015-06',
        current: false,
        description: 'Focused on software development, algorithms, and data structures. Completed capstone project on "Automated Testing Framework for Web Applications."',
        gpa: '3.6/4.0',
        order_index: 2
      },
      {
        degree: 'ISTQB Certified Tester',
        institution: 'International Software Testing Qualifications Board',
        location: 'Online',
        start_date: '2018-03',
        end_date: '2018-03',
        current: false,
        description: 'Certified Tester Foundation Level (CTFL) - International standard for software testing qualifications.',
        gpa: null,
        order_index: 3
      }
    ];

    // Insert education
    for (const edu of education) {
      await run(
        'INSERT OR IGNORE INTO education (degree, institution, location, start_date, end_date, current, description, gpa, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [edu.degree, edu.institution, edu.location, edu.start_date, edu.end_date, edu.current, edu.description, edu.gpa, edu.order_index]
      );
    }

    // Sample blog posts data
    const blogPosts = [
      {
        title: 'AI-Powered Test Automation: The Future of Quality Assurance',
        slug: 'ai-powered-test-automation-future-qa',
        excerpt: 'Explore how artificial intelligence is revolutionizing test automation with intelligent test case generation, self-healing tests, and predictive analytics.',
        content: `# AI-Powered Test Automation: The Future of Quality Assurance

Artificial Intelligence is revolutionizing the way we approach test automation. In this comprehensive guide, I'll share insights from implementing AI-powered testing solutions in enterprise environments.

## The AI Testing Revolution

AI-powered test automation offers several transformative capabilities:

### 1. Intelligent Test Case Generation

\`\`\`java
public class AITestGenerator {
    private final MachineLearningModel mlModel;
    
    public List<TestCase> generateTestCases(ApplicationModel model) {
        return mlModel
            .analyzeApplication(model)
            .generateTestScenarios()
            .prioritizeByRisk()
            .createTestCases();
    }
}
\`\`\`

### 2. Self-Healing Test Automation

AI algorithms can automatically detect UI changes and update selectors without human intervention, significantly reducing maintenance overhead.

### 3. Predictive Analytics

\`\`\`java
public class TestAnalyticsService {
    public TestPrediction predictTestOutcome(TestContext context) {
        return mlModel.predict({
            historicalData: context.getHistoricalResults(),
            codeChanges: context.getRecentChanges(),
            testComplexity: context.getTestComplexity()
        });
    }
}
\`\`\`

## AI Testing Framework Architecture

The framework consists of several key components:
- **Natural Language Processing**: Convert requirements to test cases
- **Computer Vision**: Visual regression testing with AI
- **Predictive Models**: Identify high-risk areas for testing

### Benefits of AI Testing

1. **Reduced Maintenance**: Self-healing tests reduce maintenance overhead
2. **Improved Coverage**: AI identifies edge cases humans might miss
3. **Faster Execution**: Parallel execution with intelligent prioritization
4. **Better ROI**: Higher test effectiveness with lower effort

## Implementation Strategy

Start with a pilot project focusing on:
- Stable, well-documented applications
- High-value, frequently changing features
- Clear success metrics and KPIs

## Conclusion

AI-powered test automation represents the future of quality assurance. Organizations that embrace this technology will gain significant competitive advantages in terms of speed, quality, and cost-effectiveness.`,
        tags: JSON.stringify(['AI Testing', 'Automation', 'Quality Assurance', 'Machine Learning']),
        published: true,
        published_at: new Date().toISOString()
      },
      {
        title: 'Building Robust API Testing Frameworks with Rest Assured',
        slug: 'building-robust-api-testing-frameworks-rest-assured',
        excerpt: 'Learn how to build comprehensive API testing frameworks using Rest Assured, including best practices for contract testing and data-driven testing.',
        content: `# Building Robust API Testing Frameworks with Rest Assured

API testing is a critical component of modern software development. In this guide, I'll share best practices for building robust API testing frameworks using Rest Assured.

## Framework Architecture

A well-structured API testing framework should include:

### 1. Base Configuration

\`\`\`java
@Configuration
public class ApiTestConfig {
    @Value("\${api.base.url}")
    private String baseUrl;
    
    @Bean
    public RequestSpecification requestSpec() {
        return new RequestSpecBuilder()
            .setBaseUri(baseUrl)
            .setContentType(ContentType.JSON)
            .addHeader("Authorization", "Bearer " + getAuthToken())
            .build();
    }
}
\`\`\`

### 2. Test Data Management

Implement data-driven testing with external data sources:

\`\`\`java
@DataProvider(name = "userData")
public Object[][] getUserData() {
    return new Object[][] {
        {"admin", "admin123", 200},
        {"user", "user123", 200},
        {"invalid", "wrong", 401}
    };
}
\`\`\`

### 3. Response Validation

Use Rest Assured's powerful validation capabilities:

\`\`\`java
@Test
public void testUserCreation() {
    given()
        .spec(requestSpec())
        .body(userData)
    .when()
        .post("/users")
    .then()
        .statusCode(201)
        .body("id", notNullValue())
        .body("email", equalTo(userData.getEmail()))
        .header("Location", containsString("/users/"));
}
\`\`\`

## Best Practices

1. **Contract Testing**: Ensure API contracts are validated
2. **Error Handling**: Test various error scenarios
3. **Performance**: Include response time validations
4. **Security**: Test authentication and authorization

## Conclusion

A well-designed API testing framework with Rest Assured provides comprehensive coverage and reliable validation of your APIs.`,
        tags: JSON.stringify(['API Testing', 'Rest Assured', 'Java', 'Automation']),
        published: true,
        published_at: new Date().toISOString()
      }
    ];

    // Insert blog posts
    for (const post of blogPosts) {
      await run(
        'INSERT OR IGNORE INTO blog_posts (title, slug, excerpt, content, tags, published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [post.title, post.slug, post.excerpt, post.content, post.tags, post.published, post.published_at]
      );
    }

    console.log('✅ Database seeded successfully!');
    console.log('🔑 Default admin credentials: admin@example.com / admin123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData(); 