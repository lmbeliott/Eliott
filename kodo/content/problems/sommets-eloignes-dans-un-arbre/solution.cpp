#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

const long long MOINS_INFINI = -(1LL << 60);

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> w(n + 1);
    for (int i = 1; i <= n; i++) cin >> w[i];
    vector<int> parent(n + 1, 0);
    for (int i = 2; i <= n; i++) cin >> parent[i];

    // Pour chaque sommet v (sous-arbre de v) :
    //   pris[v]   = v est choisi
    //   enfant[v] = v n'est pas choisi, mais un de ses enfants l'est
    //   libre[v]  = ni v ni ses enfants ne sont choisis
    vector<long long> pris(n + 1), enfant(n + 1), libre(n + 1);
    vector<long long> sommeLibre(n + 1, 0), sommeMax(n + 1, 0), gain(n + 1, MOINS_INFINI);

    // parent[i] < i : en parcourant i de n à 1, les enfants sont traités avant leur parent
    for (int v = n; v >= 1; v--) {
        pris[v] = w[v] + sommeLibre[v];
        libre[v] = sommeMax[v];
        enfant[v] = (gain[v] > MOINS_INFINI) ? sommeMax[v] + gain[v] : MOINS_INFINI;
        if (v > 1) {
            int p = parent[v];
            long long m = max(enfant[v], libre[v]);
            sommeLibre[p] += libre[v];
            sommeMax[p] += m;
            gain[p] = max(gain[p], pris[v] - m);
        }
    }
    cout << max({pris[1], enfant[1], libre[1]}) << "\n";
    return 0;
}
