import os
import json
import anthropic

def handler(event: dict, context) -> dict:
    """
    Чат с ИИ-ассистентом на базе Claude claude-sonnet-4-5.
    Принимает историю сообщений, возвращает ответ ассистента.
    """
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    messages = body.get('messages', [])

    if not messages:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'messages required'})
        }

    client = anthropic.Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'])

    system_prompt = """Ты — ИИ-ассистент платформы WebForge для создания сайтов. Твоя задача — помогать пользователю создавать сайты по его описанию.

Ты понимаешь запросы на русском языке и отвечаешь на русском.

Когда пользователь описывает сайт, ты:
1. Отвечаешь кратко и по делу (2-4 предложения)
2. Подтверждаешь, что применил изменения
3. Задаёшь уточняющий вопрос, чтобы улучшить сайт

В конце каждого ответа, если пользователь описал изменения для сайта, добавляй JSON-блок с командами в формате:
<site_config>
{
  "title": "название сайта если упомянуто",
  "heroText": "заголовок hero-секции если понятен",
  "heroSub": "подзаголовок если понятен",
  "ctaText": "текст кнопки если упомянут",
  "primaryColor": "#hex если цвет упомянут",
  "accentColor": "#hex если акцент упомянут",
  "bgColor": "#hex если фон упомянут",
  "textColor": "#hex если цвет текста упомянут",
  "style": "modern|minimal|bold|elegant если стиль упомянут",
  "sections": ["services","pricing","portfolio","team","contacts","reviews","blog","faq"] только те что упомянуты
}
</site_config>

Включай в site_config ТОЛЬКО те поля, которые явно упомянул пользователь. Не придумывай значения.

Если пользователь просто задаёт вопрос без описания сайта — отвечай как обычный ассистент без site_config блока.

Ты дружелюбный, профессиональный и помогаешь даже нетехническим пользователям."""

    response = client.messages.create(
        model='claude-sonnet-4-5',
        max_tokens=1024,
        system=system_prompt,
        messages=messages
    )

    reply = response.content[0].text

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'reply': reply})
    }
