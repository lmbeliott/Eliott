#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int score = 0;
    int manques = 0;
    for (int i = 0; i < n; i++) {
        int x, y;
        cin >> x >> y;
        int d = x * x + y * y;       // carré de la distance au centre
        if (d <= 10 * 10) {
            score = score + 10;
        } else if (d <= 20 * 20) {
            score = score + 8;
        } else if (d <= 30 * 30) {
            score = score + 6;
        } else if (d <= 40 * 40) {
            score = score + 4;
        } else if (d <= 50 * 50) {
            score = score + 2;
        } else {
            manques = manques + 1;
        }
    }
    cout << score << " " << manques << "\n";
    return 0;
}
