#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
using namespace std;

int n, k, borne, meilleur;
vector<int> sacs, charges;

void placer(int i) {
    if (i == n) {
        // grâce à l'élagage, toutes les charges sont < meilleur
        meilleur = *max_element(charges.begin(), charges.end());
        return;
    }
    // on essaie d'abord la mule la moins chargée
    vector<int> ordre(k);
    for (int j = 0; j < k; j++) ordre[j] = j;
    stable_sort(ordre.begin(), ordre.end(), [](int a, int b) { return charges[a] < charges[b]; });
    int precedente = -1;
    for (int j : ordre) {
        int c = charges[j];
        if (c + sacs[i] >= meilleur) break; // cette mule et les suivantes ne feront pas mieux
        if (c == precedente) continue;      // même charge qu'une mule déjà essayée
        precedente = c;
        charges[j] += sacs[i];
        placer(i + 1);
        charges[j] -= sacs[i];
        if (meilleur == borne) return;      // impossible de faire mieux : on arrête tout
    }
}

int main() {
    cin >> n >> k;
    sacs.resize(n);
    for (int i = 0; i < n; i++) cin >> sacs[i];
    // les sacs les plus lourds d'abord : les mauvaises branches échouent plus vite
    sort(sacs.begin(), sacs.end(), greater<int>());
    int total = 0;
    for (int s : sacs) total += s;
    // aucune répartition ne peut faire mieux que cette borne
    borne = max(sacs[0], (total + k - 1) / k);
    charges.assign(k, 0);
    meilleur = total + 1;   // pire que tout : la première répartition trouvée l'améliorera
    placer(0);
    cout << meilleur << "\n";
    return 0;
}
