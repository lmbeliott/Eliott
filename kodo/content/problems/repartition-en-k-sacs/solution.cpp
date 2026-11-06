#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
using namespace std;

int n, k, borne, meilleur;
vector<int> objets, charges;

void placer(int i) {
    if (i == n) {
        // grâce à l'élagage, toutes les charges sont < meilleur
        meilleur = *max_element(charges.begin(), charges.end());
        return;
    }
    // on essaie d'abord le sac le moins chargé
    vector<int> ordre(k);
    for (int j = 0; j < k; j++) ordre[j] = j;
    stable_sort(ordre.begin(), ordre.end(), [](int a, int b) { return charges[a] < charges[b]; });
    int precedente = -1;
    for (int j : ordre) {
        int c = charges[j];
        if (c + objets[i] >= meilleur) break; // ce sac et les suivants ne feront pas mieux
        if (c == precedente) continue;        // même charge qu'un sac déjà essayé
        precedente = c;
        charges[j] += objets[i];
        placer(i + 1);
        charges[j] -= objets[i];
        if (meilleur == borne) return;        // impossible de faire mieux : on arrête tout
    }
}

int main() {
    cin >> n >> k;
    objets.resize(n);
    for (int i = 0; i < n; i++) cin >> objets[i];
    // les objets les plus lourds d'abord : les mauvaises branches échouent plus vite
    sort(objets.begin(), objets.end(), greater<int>());
    int total = 0;
    for (int p : objets) total += p;
    // aucune répartition ne peut faire mieux que cette borne
    borne = max(objets[0], (total + k - 1) / k);
    charges.assign(k, 0);
    meilleur = total + 1;   // pire que tout : la première répartition trouvée l'améliorera
    placer(0);
    cout << meilleur << "\n";
    return 0;
}
