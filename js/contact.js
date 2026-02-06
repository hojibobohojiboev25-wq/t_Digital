// Contact page functionality

document.addEventListener('DOMContentLoaded', function() {
    initFAQAccordion();
    initContactForm();
});

function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');

        question.addEventListener('click', function() {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    otherItem.querySelector('.faq-toggle').textContent = '+';
                }
            });

            // Toggle current FAQ item
            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                toggle.textContent = '−';
            } else {
                answer.style.maxHeight = '0';
                toggle.textContent = '+';
            }
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        // Phone number formatting
        const phoneInput = form.querySelector('#phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 1) {
                        value = '+7 (' + value;
                    } else if (value.length <= 4) {
                        value = '+7 (' + value.substring(1);
                    } else if (value.length <= 7) {
                        value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4);
                    } else if (value.length <= 11) {
                        value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7);
                    } else {
                        value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
                    }
                }
                e.target.value = value;
            });
        }

        // Form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Validation
            if (!data.name || !data.email || !data.message) {
                showMessage('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showMessage('Пожалуйста, введите корректный email', 'error');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showMessage('Спасибо! Ваше сообщение отправлено.', 'success');
                    form.reset();
                } else {
                    showMessage(result.error || 'Ошибка при отправке', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Ошибка при отправке сообщения', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });

        function showMessage(message, type) {
            const existing = form.querySelector('.form-message');
            if (existing) existing.remove();

            const msg = document.createElement('div');
            msg.className = `form-message ${type}`;
            msg.textContent = message;
            msg.style.cssText = type === 'success'
                ? 'color: #10b981; background: #d1fae5; padding: 12px; border-radius: 6px; margin-bottom: 16px;'
                : 'color: #dc2626; background: #fee2e2; padding: 12px; border-radius: 6px; margin-bottom: 16px;';

            form.insertBefore(msg, form.firstChild);
            setTimeout(() => msg.remove(), 5000);
        }
    }
}

// Add CSS for contact page
const contactStyle = document.createElement('style');
contactStyle.textContent = `
    .faq-item.active .faq-answer {
        max-height: 500px;
    }

    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }

    .faq-toggle {
        transition: transform 0.3s ease;
    }

    .contact-form input:focus,
    .contact-form select:focus,
    .contact-form textarea:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        outline: none;
    }
`;
document.head.appendChild(contactStyle);