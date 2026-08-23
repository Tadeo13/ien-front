import re

# Leer el archivo
with open('C:/Users/test/OneDrive/Desktop/IEN-COMPLETO/IEN-demo/back/src/seed.js', 'r', encoding='utf-8') as f:
    content = f.read()

print("Aplicando cambios...")

# ============================================================
# DÍA 5: Agregar \n en contenido
# ============================================================
content = content.replace(
    "contenido: 'Beneficios del Enfoque Integral \u2014 Enfoque 360°: esta semana abordamos la salud desde tres pilares fundamentales. Mente: técnicas de mindfulness y autoconciencia. Movimiento: ejercicio consciente y conexión corporal. Nutrición: suplementación natural y timing estratégico. Prevención Inteligente: enseña a no sobreentrenar cuando el cuerpo necesita recuperación; previene la alimentación emocional mediante reconocimiento consciente; genera resultados más sostenibles y reduce la frustración. Optimización Personalizada: planificación de suplementación según tus ritmos (ej: Ashwagandha en momentos de mayor estrés); timing nutricional \u2014 programa comidas cuando tu cuerpo más lo necesita; rutina de ejercicio \u2014 establece horarios basados en tus picos de energía natural.'",
    "contenido: 'Beneficios del Enfoque Integral \u2014 Enfoque 360°: esta semana abordamos la salud desde tres pilares fundamentales.\\nMente: técnicas de mindfulness y autoconciencia.\\nMovimiento: ejercicio consciente y conexión corporal.\\nNutrición: suplementación natural y timing estratégico.\\nPrevención Inteligente: enseña a no sobreentrenar cuando el cuerpo necesita recuperación; previene la alimentación emocional mediante reconocimiento consciente; genera resultados más sostenibles y reduce la frustración.\\nOptimización Personalizada: planificación de suplementación según tus ritmos (ej: Ashwagandha en momentos de mayor estrés); timing nutricional \u2014 programa comidas cuando tu cuerpo más lo necesita; rutina de ejercicio \u2014 establece horarios basados en tus picos de energía natural.'"
)

# DÍA 7: Eliminar frase del contenido y principio
content = content.replace(
    "contenido: 'Cumplir este pequeño hito le demuestra a tu cerebro que eres capaz de mantener la disciplina.'",
    "contenido: 'Ahora tienes una herramienta concreta para demostrarte a ti mismo que puedes comprometerte y cumplir.'"
)
content = content.replace(
    "principio: 'Cumplir este pequeño hito le demuestra a tu cerebro que eres capaz de mantener la disciplina, fortaleciendo tu voluntad para retos mayores.'",
    "principio: 'Pequeños compromisos cumplidos generan grandes cambios neuronales. Cada micro-hábito sostenido fortalece tu identidad como alguien que cumple su palabra.'"
)

# DÍA 10: Mejorar acciones - separar con \n en lugar de ·
content = content.replace(
    "{ texto: '1) Momento de Protagonismo #1: ·Situación: ___ ·Acción tomada: ___ ·Cómo me sentí: ___', respuesta_tipo: 'abierta' }",
    "{ texto: '1) Momento de Protagonismo #1:\\nSituación: ___\\nAcción tomada: ___\\nCómo me sentí: ___', respuesta_tipo: 'abierta' }"
)
content = content.replace(
    "{ texto: '2) Momento de Protagonismo #2: ·Situación: ___ ·Acción tomada: ___ ·Cómo me sentí: ___', respuesta_tipo: 'abierta' }",
    "{ texto: '2) Momento de Protagonismo #2:\\nSituación: ___\\nAcción tomada: ___\\nCómo me sentí: ___', respuesta_tipo: 'abierta' }"
)
content = content.replace(
    "{ texto: '3) Momento de Protagonismo #3: ·Situación: ___ ·Acción tomada: ___ ·Cómo me sentí: ___', respuesta_tipo: 'abierta' }",
    "{ texto: '3) Momento de Protagonismo #3:\\nSituación: ___\\nAcción tomada: ___\\nCómo me sentí: ___', respuesta_tipo: 'abierta' }"
)

# DÍA 5: Agregar \n en contenido
content = content.replace(
    "contenido: 'Beneficios del Enfoque Integral \u2014 Enfoque 360°: esta semana abordamos la salud desde tres pilares fundamentales. Mente: técnicas de mindfulness y autoconciencia. Movimiento: ejercicio consciente y conexión corporal. Nutrición: suplementación natural y timing estratégico. Prevención Inteligente: enseña a no sobreentrenar cuando el cuerpo necesita recuperación; previene la alimentación emocional mediante reconocimiento consciente; genera resultados más sostenibles y reduce la frustración. Optimización Personalizada: planificación de suplementación según tus ritmos (ej: Ashwagandha en momentos de mayor estrés); timing nutricional \u2014 programa comidas cuando tu cuerpo más lo necesita; rutina de ejercicio \u2014 establece horarios basados en tus picos de energía natural.'",
    "contenido: 'Beneficios del Enfoque Integral \u2014 Enfoque 360°: esta semana abordamos la salud desde tres pilares fundamentales.\\nMente: técnicas de mindfulness y autoconciencia.\\nMovimiento: ejercicio consciente y conexión corporal.\\nNutrición: suplementación natural y timing estratégico.\\nPrevención Inteligente: enseña a no sobreentrenar cuando el cuerpo necesita recuperación; previene la alimentación emocional mediante reconocimiento consciente; genera resultados más sostenibles y reduce la frustración.\\nOptimización Personalizada: planificación de suplementación según tus ritmos (ej: Ashwagandha en momentos de mayor estrés); timing nutricional \u2014 programa comidas cuando tu cuerpo más lo necesita; rutina de ejercicio \u2014 establece horarios basados en tus picos de energía natural.'"
)

# DÍA 7: Eliminar frase del contenido y principio
content = content.replace(
    "contenido: 'Cumplir este pequeño hito le demuestra a tu cerebro que eres capaz de mantener la disciplina.'",
    "contenido: 'Ahora tienes una herramienta concreta para demostrarte a ti mismo que puedes comprometerte y cumplir.'"
)
content = content.replace(
    "principio: 'Cumplir este pequeño hito le demuestra a tu cerebro que eres capaz de mantener la disciplina, fortaleciendo tu voluntad para retos mayores.'",
    "principio: 'Pequeños compromisos cumplidos generan grandes cambios neuronales. Cada micro-hábito sostenido fortalece tu identidad como alguien que cumple su palabra.'"
)

# DÍA 10: Mejorar acciones - separar con \n en lugar de ·
content = content.replace(
    "{ texto: '1) Momento de Protagonismo #1: ·Situación: ___ ·Acción tomada: ___ ·Cómo me sentí: ___', respuesta_tipo: 'abierta' }",
    "{ texto: '1) Momento de Protagonismo #1:\\nSituación: ___\\nAcción tomada: ___\\nCómo me sentí: ___', respuesta_tipo: 'abierta' }"
)
content = content.replace(
    "{ texto: '2) Momento de Protagonismo #2: ·Situación: ___ ·Acción tomada: ___ ·Cómo me sentí: ___', respuesta_tipo: 'abierta' }",
    "{ texto: '2) Momento de Protagonismo #2:\\nSituación: ___\\nAcción tomada: ___\\nCómo me sentí: ___', respuesta_tipo: 'abierta' }"
)
content = content.replace(
    "{ texto: '3) Momento de Protagonismo #3: ·Situación: ___ ·Acción tomada: ___ ·Cómo me sentí: ___', respuesta_tipo: 'abierta' }",
    "{ texto: '3) Momento de Protagonismo #3:\\nSituación: ___\\nAcción tomada: ___\\nCómo me sentí: ___', respuesta_tipo: 'abierta' }"
)

# DÍA 12: Eliminar frase del contenido y principio; agregar \n
content = content.replace(
    "contenido: 'Cumplir este horario entrena al cerebro en autoeficacia y regula el cortisol, la hormona del estrés que dispara la ingesta emocional.'",
    "contenido: 'Establecer una hora sagrada diaria crea anclajes circadianos que regulan el cortisol y optimizan tu energía.'"
)
content = content.replace(
    "principio: 'Principio Clave: cumplir este horario entrena al cerebro en autoeficacia y ayuda a regular el cortisol, la hormona del estrés que dispara la ingesta emocional.'",
    "principio: 'La regularidad circadianas es la base de la autoeficacia. Una hora sagrada diaria regula tu cortisol y optimiza tu energía metabólica.'"
)

# DÍA 13: Mejorar \n en contenido
content = content.replace(
    "contenido: 'Optimización del Espacio de Suplementación:\\n• Crea una \"estación de bienestar\": lugar visible con suplementos organizados\\n• Recordatorios visuales: notas adhesivas con horarios de toma\\n• Agua siempre disponible: botella llena junto a los suplementos'",
    "contenido: 'Optimización del Espacio de Suplementación:\\n• Crea una \"estación de bienestar\": lugar visible con suplementos organizados\\n• Recordatorios visuales: notas adhesivas con horarios de toma\\n• Agua siempre disponible: botella llena junto a los suplementos\\n\\nEjemplos Prácticos de Transformación:\\n• Control remoto en sofá → Cajón del mueble → Mat de yoga visible\\n• Snacks procesados → Despensa alta → Frutas a la vista\\n• Celular en mesa de noche → Cargador en sala → Libro de mindfulness'"
)

# DÍA 14: Igual que día 13 (mejorar \n en contenido)
content = content.replace(
    "contenido: 'Momentos de Aplicación Obligatoria:\\n• Pre-Comida Principal: 3 ciclos · \"Yo controlo mis decisiones alimentarias\"\\n• Pre-Entrenamiento: 3 ciclos · \"Mi cuerpo está preparado para el movimiento\"\\n• Pre-Suplementación: 1 ciclo · \"Elijo nutrir mi cuerpo conscientemente\"\\n\\nFrase de Empoderamiento: \"Yo controlo mis acciones; mis impulsos momentáneos no definen mi salud\"",
    "contenido: 'Momentos de Aplicación Obligatoria:\\n• Pre-Comida Principal: 3 ciclos · \"Yo controlo mis decisiones alimentarias\"\\n• Pre-Entrenamiento: 3 ciclos · \"Mi cuerpo está preparado para el movimiento\"\\n• Pre-Suplementación: 1 ciclo · \"Elijo nutrir mi cuerpo conscientemente\"\\n\\nFrase de Empoderamiento: \"Yo controlo mis acciones; mis impulsos momentáneos no definen mi salud\""
)

# DÍA 15: Mejorar estructura respuestas (labels más claros)
content = content.replace(
    "{ texto: 'Ansiedad — intensidad ____/10 · duración real ____min · estrategia usada: ABLANDAR-PERMITIR-AMAR', respuesta_tipo: 'abierta' }",
    "{ texto: 'Ansiedad — intensidad ____/10 · duración real ____min · estrategia: ABLANDAR-PERMITIR-AMAR', respuesta_tipo: 'abierta' }"
)
content = content.replace(
    "{ texto: 'Frustración — intensidad ____/10 · duración real ____min · estrategia usada: Respiración + observación', respuesta_tipo: 'abierta' }",
    "{ texto: 'Frustración — intensidad ____/10 · duración real ____min · estrategia: Respiración + observación', respuesta_tipo: 'abierta' }"
)
content = content.replace(
    "{ texto: 'Aburrimiento — intensidad ____/10 · duración real ____min · estrategia usada: Tolerancia sin distracción', respuesta_tipo: 'abierta' }",
    "{ texto: 'Aburrimiento — intensidad ____/10 · duración real ____min · estrategia: Tolerancia sin distracción', respuesta_tipo: 'abierta' }"
)

# DÍA 16: Agregar \n en contenido
content = content.replace(
    "contenido: 'La visualización repetida crea mapas neuronales que el cerebro interpreta como experiencias reales.'",
    "contenido: 'La visualización repetida crea mapas neuronales que el cerebro interpreta como experiencias reales.\\n\\nFase 1: Proyección temporal a 10 años.\\nFase 2: Experiencia sensorial completa.\\nFase 3: Conexión emocional con tu propósito.'"
)

# DÍA 17: Eliminar frase del contenido
content = content.replace(
    "contenido: 'Conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco.'",
    "contenido: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 19: \n en contenido + mejorar respuestas
content = content.replace(
    "contenido: 'Beneficios del Enfoque Energético:\\n• Motivación intrínseca: el foco en energía genera satisfacción inmediata\\n• Sostenibilidad: no depende de fluctuaciones de peso\\n• Conexión propósito: vincula nutrición con metas de vida reales'",
    "contenido: 'Beneficios del Enfoque Energético:\\n• Motivación intrínseca: el foco en energía genera satisfacción inmediata\\n• Sostenibilidad: no depende de fluctuaciones de peso\\n• Conexión propósito: vincula nutrición con metas de vida reales\\n\\nIdentifica en tu plato:\\n• Proteína: alimento ___ → reparación muscular y neurotransmisores\\n• Carbohidratos complejos: alimento ___ → energía sostenida para cerebro\\n• Grasas saludables: alimento ___ → absorción de vitaminas y hormonas\\n• Vitaminas/minerales: alimento ___ → cofactores para producción de ATP'"
)

# DÍA 20: \n en contenido
content = content.replace(
    "contenido: 'Consolidación y Mantenimiento · Cierre Transformacional: cuidar tu corazón hoy es asegurar que tu motor interno tenga la potencia necesaria para llegar a donde deseas en la vida.\\n\\n\"No se trata de ser perfecto; se trata de ser consciente, confiado, controlado y motivado desde adentro.\"\\n\\nTu Compromiso Sagrado: \"Prometo honrar el trabajo que he hecho en estos 20 días. Prometo recordar que tengo el poder de elegir conscientemente. Prometo ser gentil conmigo mismo en el proceso y valiente en mis decisiones. Prometo vivir desde mi \'quiero\' más profundo, no desde mis \'tengo que\' superficiales.\"",
    "contenido: 'Consolidación y Mantenimiento · Cierre Transformacional: cuidar tu corazón hoy es asegurar que tu motor interno tenga la potencia necesaria para llegar a donde deseas en la vida.\\n\\n\"No se trata de ser perfecto; se trata de ser consciente, confiado, controlado y motivado desde adentro.\"\\n\\nTu Compromiso Sagrado: \"Prometo honrar el trabajo que he hecho en estos 20 días. Prometo recordar que tengo el poder de elegir conscientemente. Prometo ser gentil conmigo mismo en el proceso y valiente en mis decisiones. Prometo vivir desde mi \\'quiero\\' más profundo, no desde mis \\'tengo que\\' superficiales.\"'"
)

# DÍA 21: \n en contenido
content = content.replace(
    "contenido: 'Hablarte con amabilidad reduce el estrés sistémico, permitiendo que tu corazón y metabolismo funcionen mejor.'",
    "contenido: 'Hablarte con amabilidad reduce el estrés sistémico, permitiendo que tu corazón y metabolismo funcionen mejor.\\n\\nLa autocompasión activa el nervio vago, reduce la inflamación y mejora la variabilidad de la frecuencia cardíaca.'"
)

# DÍA 22: Mejorar distribución (labels más claros)
content = content.replace(
    "{ texto: '1) Fecha: ___', respuesta_tipo: 'abierta' }",
    "{ texto: 'Fecha: ___', respuesta_tipo: 'abierta' }"
)
content = content.replace(
    "{ texto: '2) Situación: ___', respuesta_tipo: 'abierta' }",
    "{ texto: 'Situación: ___', respuesta_tipo: 'abierta' }"
)
content = content.replace(
    "{ texto: '3) Mi respuesta: ___', respuesta_tipo: 'abierta' }",
    "{ texto: 'Mi respuesta: ___', respuesta_tipo: 'abierta' }"
)
content = content.replace(
    "{ texto: '4) Dato que esto me enseña: ___', respuesta_tipo: 'abierta' }",
    "{ texto: 'Dato que esto me enseña: ___', respuesta_tipo: 'abierta' }"
)
content = content.replace(
    "{ texto: '5) Mi próxima acción de autocuidado: ___', respuesta_tipo: 'abierta' }",
    "{ texto: 'Próxima acción de autocuidado: ___', respuesta_tipo: 'abierta' }"
)
content = content.replace(
    "{ texto: '6) Razón por la que elijo esta acción: ___', respuesta_tipo: 'abierta' }",
    "{ texto: 'Razón de la acción elegida: ___', respuesta_tipo: 'abierta' }"
)
content = content.replace(
    "{ texto: '7) Firma de autocompasión: ___', respuesta_tipo: 'abierta' }",
    "{ texto: 'Firma de autocompasión: ___', respuesta_tipo: 'abierta' }"
)

# DÍA 23: \n en contenido
content = content.replace(
    "contenido: 'Conexión Científica: la gratitud activa el sistema nervioso parasimpático, mejorando la variabilidad de la frecuencia cardíaca y reduciendo la inflamación sistémica.'",
    "contenido: 'Conexión Científica: la gratitud activa el sistema nervioso parasimpático, mejorando la variabilidad de la frecuencia cardíaca y reduciendo la inflamación sistémica.\\n\\nPractica la gratitud cardiovascular diaria para proteger tu corazón.'"
)

# DÍA 24: Eliminar frase del contenido
content = content.replace(
    "contenido: 'Beneficio Integral: cultivar relaciones sanas protege tu salud mental y evita que utilices la comida como consuelo ante el estrés interpersonal.'",
    "contenido: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 26: \n en contenido
content = content.replace(
    "contenido: 'Principio Científico: practicar límites claros reduce el estrés social, protegiendo tu equilibrio emocional y tu presión arterial en entornos compartidos.'",
    "contenido: 'Principio Científico: practicar límites claros reduce el estrés social, protegiendo tu equilibrio emocional y tu presión arterial en entornos compartidos.\\n\\nEjemplos de guiones asertivos listos para usar:\\n• Presión para comer: \"Se ve delicioso, pero estoy satisfecho/a. Gracias por pensar en mí\"\\n• Presión para beber: \"Hoy elijo no beber alcohol, prefiero mantener mi claridad mental\"\\n• Críticas: \"Entiendo que puede parecer diferente, pero me siento muy bien así\""
)

# DÍA 27: \n en contenido
content = content.replace(
    "contenido: 'Principio de Preparación Inteligente: no llegar con hambre física o ansiedad al evento te permite elegir desde la razón y no desde el impulso emocional.'",
    "contenido: 'Principio de Preparación Inteligente: no llegar con hambre física o ansiedad al evento te permite elegir desde la razón y no desde el impulso emocional.\\n\\nKit de Emergencia: agua · L-Teanina · snack saludable · recordatorio de tu \"porqué\"'"
)

# DÍA 24: Eliminar frase del contenido
content = content.replace(
    "contenido: 'Beneficio Integral: cultivar relaciones sanas protege tu salud mental y evita que utilices la comida como consuelo ante el estrés interpersonal.'",
    "contenido: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 26: \n en contenido
content = content.replace(
    "contenido: 'Principio Científico: practicar límites claros reduce el estrés social, protegiendo tu equilibrio emocional y tu presión arterial en entornos compartidos.'",
    "contenido: 'Principio Científico: practicar límites claros reduce el estrés social, protegiendo tu equilibrio emocional y tu presión arterial en entornos compartidos.\\n\\nEjemplos de guiones asertivos listos para usar:\\n• Presión para comer: \"Se ve delicioso, pero estoy satisfecho/a. Gracias por pensar en mí\"\\n• Presión para beber: \"Hoy elijo no beber alcohol, prefiero mantener mi claridad mental\"\\n• Críticas: \"Entiendo que puede parecer diferente, pero me siento muy bien así\""
)

# DÍA 27: \n en contenido
content = content.replace(
    "contenido: 'Principio de Preparación Inteligente: no llegar con hambre física o ansiedad al evento te permite elegir desde la razón y no desde el impulso emocional.'",
    "contenido: 'Principio de Preparación Inteligente: no llegar con hambre física o ansiedad al evento te permite elegir desde la razón y no desde el impulso emocional.\\n\\nKit de Emergencia: agua · L-Teanina · snack saludable · recordatorio de tu \"porqué\"'"
)

# DÍA 24: Eliminar frase del contenido
content = content.replace(
    "contenido: 'Beneficio Integral: cultivar relaciones sanas protege tu salud mental y evita que utilices la comida como consuelo ante el estrés interpersonal.'",
    "contenido: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del contenido
content = content.replace(
    "contenido: 'Conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco.'",
    "contenido: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 12: Eliminar frase del contenido y principio
content = content.replace(
    "contenido: 'Cumplir este horario entrena al cerebro en autoeficacia y regula el cortisol, la hormona del estrés que dispara la ingesta emocional.'",
    "contenido: 'Establecer una hora sagrada diaria crea anclajes circadianos que regulan el cortisol y optimizan tu energía.'"
)
content = content.replace(
    "principio: 'Principio Clave: cumplir este horario entrena al cerebro en autoeficacia y ayuda a regular el cortisol, la hormona del estrés que dispara la ingesta emocional.'",
    "principio: 'La regularidad circadianas es la base de la autoeficacia. Una hora sagrada diaria regula tu cortisol y optimiza tu energía metabólica.'"
)

# DÍA 17: Eliminar frase del contenido
content = content.replace(
    "contenido: 'Conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco.'",
    "contenido: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del contenido
content = content.replace(
    "contenido: 'Beneficio Integral: cultivar relaciones sanas protege tu salud mental y evita que utilices la comida como consuelo ante el estrés interpersonal.'",
    "contenido: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 7: Eliminar frase del contenido y principio; mejorar \n
content = content.replace(
    "contenido: 'Cumplir este pequeño hito le demuestra a tu cerebro que eres capaz de mantener la disciplina.'",
    "contenido: 'Ahora tienes una herramienta concreta para demostrarte a ti mismo que puedes comprometerte y cumplir.'"
)
content = content.replace(
    "principio: 'Cumplir este pequeño hito le demuestra a tu cerebro que eres capaz de mantener la disciplina, fortaleciendo tu voluntad para retos mayores.'",
    "principio: 'Pequeños compromisos cumplidos generan grandes cambios neuronales. Cada micro-hábito sostenido fortalece tu identidad como alguien que cumple su palabra.'"
)

# DÍA 12: Eliminar frase del contenido y principio
content = content.replace(
    "contenido: 'Cumplir este horario entrena al cerebro en autoeficacia y regula el cortisol, la hormona del estrés que dispara la ingesta emocional.'",
    "contenido: 'Establecer una hora sagrada diaria crea anclajes circadianos que regulan el cortisol y optimizan tu energía.'"
)
content = content.replace(
    "principio: 'Principio Clave: cumplir este horario entrena al cerebro en autoeficacia y ayuda a regular el cortisol, la hormona del estrés que dispara la ingesta emocional.'",
    "principio: 'La regularidad circadianas es la base de la autoeficacia. Una hora sagrada diaria regula tu cortisol y optimiza tu energía metabólica.'"
)

# DÍA 24: Eliminar frase del contenido
content = content.replace(
    "contenido: 'Beneficio Integral: cultivar relaciones sanas protege tu salud mental y evita que utilices la comida como consuelo ante el estrés interpersonal.'",
    "contenido: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 7: Eliminar frase del contenido y principio; mejorar \n
content = content.replace(
    "contenido: 'Cumplir este pequeño hito le demuestra a tu cerebro que eres capaz de mantener la disciplina.'",
    "contenido: 'Ahora tienes una herramienta concreta para demostrarte a ti mismo que puedes comprometerte y cumplir.'"
)
content = content.replace(
    "principio: 'Cumplir este pequeño hito le demuestra a tu cerebro que eres capaz de mantener la disciplina, fortaleciendo tu voluntad para retos mayores.'",
    "principio: 'Pequeños compromisos cumplidos generan grandes cambios neuronales. Cada micro-hábito sostenido fortalece tu identidad como alguien que cumple su palabra.'"
)

# DÍA 12: Eliminar frase del contenido y principio
content = content.replace(
    "contenido: 'Cumplir este horario entrena al cerebro en autoeficacia y regula el cortisol, la hormona del estrés que dispara la ingesta emocional.'",
    "contenido: 'Establecer una hora sagrada diaria crea anclajes circadianos que regulan el cortisol y optimizan tu energía.'"
)
content = content.replace(
    "principio: 'Principio Clave: cumplir este horario entrena al cerebro en autoeficacia y ayuda a regular el cortisol, la hormona del estrés que dispara la ingesta emocional.'",
    "principio: 'La regularidad circadianas es la base de la autoeficacia. Una hora sagrada diaria regula tu cortisol y optimiza tu energía metabólica.'"
)

# DÍA 24: Eliminar frase del contenido
content = content.replace(
    "contenido: 'Beneficio Integral: cultivar relaciones sanas protege tu salud mental y evita que utilices la comida como consuelo ante el estrés interpersonal.'",
    "contenido: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 7: Eliminar frase del contenido y principio; mejorar \n
content = content.replace(
    "contenido: 'Cumplir este pequeño hito le demuestra a tu cerebro que eres capaz de mantener la disciplina.'",
    "contenido: 'Ahora tienes una herramienta concreta para demostrarte a ti mismo que puedes comprometerte y cumplir.'"
)
content = content.replace(
    "principio: 'Cumplir este pequeño hito le demuestra a tu cerebro que eres capaz de mantener la disciplina, fortaleciendo tu voluntad para retos mayores.'",
    "principio: 'Pequeños compromisos cumplidos generan grandes cambios neuronales. Cada micro-hábito sostenido fortalece tu identidad como alguien que cumple su palabra.'"
)

# DÍA 12: Eliminar frase del contenido y principio
content = content.replace(
    "contenido: 'Cumplir este horario entrena al cerebro en autoeficacia y regula el cortisol, la hormona del estrés que dispara la ingesta emocional.'",
    "contenido: 'Establecer una hora sagrada diaria crea anclajes circadianos que regulan el cortisol y optimizan tu energía.'"
)
content = content.replace(
    "principio: 'Principio Clave: cumplir este horario entrena al cerebro en autoeficacia y ayuda a regular el cortisol, la hormona del estrés que dispara la ingesta emocional.'",
    "principio: 'La regularidad circadianas es la base de la autoeficacia. Una hora sagrada diaria regula tu cortisol y optimiza tu energía metabólica.'"
)

# DÍA 24: Eliminar frase del contenido
content = content.replace(
    "contenido: 'Beneficio Integral: cultivar relaciones sanas protege tu salud mental y evita que utilices la comida como consuelo ante el estrés interpersonal.'",
    "contenido: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 7: Eliminar frase del contenido y principio; mejorar \n
content = content.replace(
    "contenido: 'Cumplir este pequeño hito le demuestra a tu cerebro que eres capaz de mantener la disciplina.'",
    "contenido: 'Ahora tienes una herramienta concreta para demostrarte a ti mismo que puedes comprometerte y cumplir.'"
)
content = content.replace(
    "principio: 'Cumplir este pequeño hito le demuestra a tu cerebro que eres capaz de mantener la disciplina, fortaleciendo tu voluntad para retos mayores.'",
    "principio: 'Pequeños compromisos cumplidos generan grandes cambios neuronales. Cada micro-hábito sostenido fortalece tu identidad como alguien que cumple su palabra.'"
)

# DÍA 12: Eliminar frase del contenido y principio
content = content.replace(
    "contenido: 'Cumplir este horario entrena al cerebro en autoeficacia y regula el cortisol, la hormona del estrés que dispara la ingesta emocional.'",
    "contenido: 'Establecer una hora sagrada diaria crea anclajes circadianos que regulan el cortisol y optimizan tu energía.'"
)
content = content.replace(
    "principio: 'Principio Clave: cumplir este horario entrena al cerebro en autoeficacia y ayuda a regular el cortisol, la hormona del estrés que dispara la ingesta emocional.'",
    "principio: 'La regularidad circadianas es la base de la autoeficacia. Una hora sagrada diaria regula tu cortisol y optimiza tu energía metabólica.'"
)

# DÍA 24: Eliminar frase del contenido
content = content.replace(
    "contenido: 'Beneficio Integral: cultivar relaciones sanas protege tu salud mental y evita que utilices la comida como consuelo ante el estrés interpersonal.'",
    "contenido: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# DÍA 17: Eliminar frase del principio
content = content.replace(
    "principio: 'Transformación: conectar acciones diarias con valores profundos activa el sistema de recompensa intrínseco, haciendo que el cuidado personal se sienta natural, no forzado.'",
    "principio: 'Escribe tu \"porqué\" en un post-it y ponlo donde lo veas cada mañana. Léelo en voz alta 7 días seguidos.'"
)

# DÍA 24: Eliminar frase del principio
content = content.replace(
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'",
    "principio: 'Cultivar relaciones sanas protege tu salud mental y evita la alimentación emocional.'"
)

# Guardar cambios
with open('C:/Users/test/OneDrive/Desktop/IEN-COMPLETO/IEN-demo/back/src/seed.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("OK Cambios aplicados al seed.js")
print("Ejecutando verificación...")