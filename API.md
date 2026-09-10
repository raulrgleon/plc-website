# API — afiliación

Contrato esperado por el frontend de `afiliarse.html`. El backend lo despliega el servidor (no forma parte de este repo estático).

## `POST /api/afiliacion`

**Content-Type:** `application/json`

### Body

```json
{
  "nombre_completo": "string (required)",
  "email": "string (required, email)",
  "telefono": "string (optional)",
  "pais_residencia": "string (required)",
  "ciudad": "string (optional)",
  "situacion": "Cubano/a en Cuba | Cubano/a en el exterior | Simpatizante (no cubano/a)",
  "comisiones": ["string", "..."],
  "motivacion": "string (optional)",
  "accept_privacidad": true,
  "accept_principios": true,
  "timestamp": "2026-09-10T21:00:00.000Z",
  "website": ""
}
```

Notas:

- `comisiones` es un array (puede ir vacío). Valores posibles:  
  `Programa político y visión de país`, `Estrategia económica`, `Carta de Derechos y Libertades`, `Integración regional/global y retorno del exilio`, `Comunicación y transparencia`, `Sistema electoral primario`.
- `timestamp` es opcional (el cliente lo envía en ISO-8601).
- Campo honeypot `website`: si llega con valor no vacío, **rechazar en silencio** (responder `{ "ok": true }` sin persistir) o devolver 400.

### Respuestas

| Status | Body | Uso |
|--------|------|-----|
| `200` | `{ "ok": true }` | Solicitud aceptada |
| `400` | `{ "ok": false, "error": "…" }` | Validación / datos incompletos |
| `429` | `{ "ok": false, "error": "…" }` | Rate limit |

Cualquier otra respuesta no-OK se muestra como error genérico en el formulario.
