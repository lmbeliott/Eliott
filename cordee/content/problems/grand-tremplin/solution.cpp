#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> sauts(n);
    for (int i = 0; i < n; i++) {
        cin >> sauts[i];
    }
    // Position du meilleur saut vu jusqu'ici : au départ, le premier sauteur.
    int meilleur = 0;
    for (int i = 1; i < n; i++) {
        // Strictement plus loin : en cas d'égalité, le premier garde sa place.
        if (sauts[i] > sauts[meilleur]) {
            meilleur = i;
        }
    }
    // Les positions commencent à 0, les dossards à 1.
    cout << meilleur + 1 << " " << sauts[meilleur] << "\n";
    return 0;
}
