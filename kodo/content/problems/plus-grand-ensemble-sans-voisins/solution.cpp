#include <iostream>
#include <vector>
using namespace std;

typedef unsigned long long ull;
int n;
vector<ull> voisins;                     // voisins[v] : masque des voisins de v
int meilleur = 0;

void chercher(ull restants, int taille) {
    // règle 1 : si les voisins restants de v sont deux à deux voisins, on peut prendre v
    bool change = true;
    while (change) {
        change = false;
        for (ull r = restants; r; r &= r - 1) {
            int v = __builtin_ctzll(r);
            if (!((restants >> v) & 1)) continue;
            ull ferme = (voisins[v] | (1ULL << v)) & restants;
            bool simplicial = true;
            for (ull w = voisins[v] & restants; w; w &= w - 1) {
                int u = __builtin_ctzll(w);
                if (ferme & ~(voisins[u] | (1ULL << u))) {
                    simplicial = false;
                    break;
                }
            }
            if (simplicial) {
                restants &= ~ferme;
                taille++;
                change = true;
            }
        }
    }
    // règle 2 : même en prenant tous les sommets restants, on ne battrait pas le meilleur
    if (taille + __builtin_popcountll(restants) <= meilleur) return;
    if (restants == 0) {
        meilleur = taille;
        return;
    }
    // branchement sur un sommet de degré maximal : on le prend, ou on l'écarte
    int v_max = -1, d_max = -1;
    for (ull r = restants; r; r &= r - 1) {
        int v = __builtin_ctzll(r);
        int d = __builtin_popcountll(voisins[v] & restants);
        if (d > d_max) {
            v_max = v;
            d_max = d;
        }
    }
    chercher(restants & ~(voisins[v_max] | (1ULL << v_max)), taille + 1);
    chercher(restants & ~(1ULL << v_max), taille);
}

int main() {
    int m;
    cin >> n >> m;
    voisins.assign(n, 0);
    for (int k = 0; k < m; k++) {
        int a, b;
        cin >> a >> b;
        a--;
        b--;
        voisins[a] |= 1ULL << b;
        voisins[b] |= 1ULL << a;
    }
    ull tous = (n == 64) ? ~0ULL : ((1ULL << n) - 1);
    chercher(tous, 0);
    cout << meilleur << "\n";
    return 0;
}
